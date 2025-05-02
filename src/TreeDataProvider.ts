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
      ".tsv",
      ".json",
      ".xml",
      ".html",
      ".css",
      ".js",
      ".ts",
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
      // 各拡張子ごとにファイルを検索
      for (const ext of fileExtensions) {
        const pattern = `**/*${ext}`;
        const exclude = `{${excludePatterns.join(",")}}`;

        this.logger.debug("Searching for files", {
          pattern,
          exclude,
          extension: ext,
        });
        const uris = await vscode.workspace.findFiles(pattern, exclude);
        this.logger.debug(`Found ${ext} files`, {
          count: uris.length,
          files: uris.map((uri) => uri.fsPath),
        });

        for (const uri of uris) {
          const filePath = uri.fsPath;
          this.logger.debug("Processing file", {
            filePath,
            extension: ext,
            exists: fs.existsSync(filePath),
          });

          if (this.charsetDetector.shouldProcessFile(filePath)) {
            const relativePath = path.relative(workspaceFolder, filePath);
            files.push(relativePath);
            this.logger.debug("Added file", {
              file: relativePath,
              extension: ext,
              absolutePath: filePath,
            });
          } else {
            this.logger.debug("Skipped file", {
              file: filePath,
              extension: ext,
              reason: "shouldProcessFile returned false",
            });
          }
        }
      }

      this.logger.debug("Processed files summary", {
        total: files.length,
        extensions: fileExtensions,
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
