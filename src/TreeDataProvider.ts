import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { CharsetDetector } from "./extension";
import { Logger } from "./logger";

export class CharsetTreeDataProvider
  implements vscode.TreeDataProvider<FileItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    FileItem | undefined | null | void
  > = new vscode.EventEmitter<FileItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    FileItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  private charsetDetector: CharsetDetector;
  private logger: Logger;

  constructor() {
    this.charsetDetector = CharsetDetector.getInstance();
    this.logger = Logger.getInstance();
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: FileItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: FileItem): Promise<FileItem[]> {
    if (!vscode.workspace.workspaceFolders) {
      this.logger.debug("No workspace folders found");
      return [];
    }

    if (element) {
      return [];
    }

    const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
    const files = await this.getWorkspaceFiles(workspaceFolder);

    return Promise.all(
      files.map(async (file) => {
        const filePath = path.join(workspaceFolder, file);
        const charset = await this.charsetDetector.detectCharset(filePath);
        return new FileItem(
          file,
          charset,
          vscode.TreeItemCollapsibleState.None,
          {
            command: "viewcharset.openFile",
            title: "Open File",
            arguments: [filePath],
          }
        );
      })
    );
  }

  public async getWorkspaceFiles(workspaceFolder: string): Promise<string[]> {
    const files: string[] = [];
    const config = vscode.workspace.getConfiguration("viewCharset");
    const fileExtensions = config.get<string[]>("fileExtensions", [
      ".txt",
      ".csv",
      ".json",
      ".xml",
      ".html",
      ".css",
      ".js",
      ".ts",
      ".md",
      ".jsx",
      ".tsx",
      ".yaml",
      ".yml"
    ]);
    const excludePatterns = config.get<string[]>("excludePatterns", [
      "**/node_modules/**",
      "**/.git/**",
    ]);

    this.logger.debug("Configuration", {
      workspaceFolder,
      fileExtensions,
      excludePatterns,
    });

    try {
      // すべての拡張子を一度に検索
      const pattern = `**/*{${fileExtensions.join(",")}}`;
      const exclude = `{${excludePatterns.join(",")}}`;

      this.logger.debug("Searching for files", {
        pattern,
        exclude,
      });

      const uris = await vscode.workspace.findFiles(pattern, exclude);
      this.logger.debug("Found files", {
        count: uris.length,
      });

      for (const uri of uris) {
        const filePath = uri.fsPath;
        this.logger.debug("Processing file", {
          filePath,
          exists: fs.existsSync(filePath),
        });

        if (this.charsetDetector.shouldProcessFile(filePath)) {
          const relativePath = path.relative(workspaceFolder, filePath);
          files.push(relativePath);
          this.logger.debug("Added file", {
            file: relativePath,
            absolutePath: filePath,
          });
        } else {
          this.logger.debug("Skipped file", {
            file: filePath,
            reason: "shouldProcessFile returned false",
          });
        }
      }

      this.logger.debug("Processed files summary", {
        total: files.length,
        files: files,
        workspaceFolder,
      });
    } catch (error) {
      this.logger.error("Error finding files", {
        error,
        workspaceFolder,
        fileExtensions,
        excludePatterns,
      });
    }

    return files;
  }
}

class FileItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    charset: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label} (${charset})`;
    this.description = charset;
  }

  contextValue = "file";
}
