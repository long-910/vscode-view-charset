import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { CharsetDetector } from "./charsetDetector";
import { Logger } from "./logger";

export class CharsetTreeDataProvider
  implements vscode.TreeDataProvider<FolderItem | FileItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    FolderItem | FileItem | undefined | null | void
  > = new vscode.EventEmitter<FolderItem | FileItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    FolderItem | FileItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  private charsetDetector: CharsetDetector;
  private logger: Logger;
  /** フォルダキー → 子アイテム一覧。refresh() 時にリセット */
  private treeCache: Map<string, Array<FolderItem | FileItem>> | null = null;

  constructor() {
    this.charsetDetector = CharsetDetector.getInstance();
    this.logger = Logger.getInstance();
  }

  refresh(): void {
    this.treeCache = null;
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: FolderItem | FileItem): vscode.TreeItem {
    return element;
  }

  async getChildren(
    element?: FolderItem | FileItem
  ): Promise<Array<FolderItem | FileItem>> {
    if (!vscode.workspace.workspaceFolders) {
      this.logger.debug("No workspace folders found");
      return [];
    }

    // FileItem は葉ノード。FolderItem 以外の element も葉として扱う
    if (element && !(element instanceof FolderItem)) {
      return [];
    }

    const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;

    if (!this.treeCache) {
      this.treeCache = await this.buildTreeCache(workspaceFolder);
    }

    const key = element instanceof FolderItem ? element.folderKey : "";
    return this.treeCache.get(key) ?? [];
  }

  /**
   * フォルダ相対パスをキーとして子アイテムを保持するキャッシュを構築する。
   * ルートのキーは空文字列 `''`。
   */
  private async buildTreeCache(
    workspaceFolder: string
  ): Promise<Map<string, Array<FolderItem | FileItem>>> {
    const cache = new Map<string, Array<FolderItem | FileItem>>();
    cache.set("", []);

    const files = await this.getWorkspaceFiles(workspaceFolder);

    // 各ファイルの文字コードを並列取得
    const settled = await Promise.allSettled(
      files.map(async (relativePath) => {
        const normalized = relativePath.replace(/\\/g, "/");
        const absolutePath = path.join(workspaceFolder, relativePath);
        const charset = await this.charsetDetector.detectCharset(absolutePath);
        return { normalized, absolutePath, charset };
      })
    );

    for (const result of settled) {
      if (result.status === "rejected") {
        this.logger.error("Failed to process file for tree", {
          error: result.reason,
        });
        continue;
      }

      const { normalized, absolutePath, charset } = result.value;
      const parts = normalized.split("/");

      // 祖先フォルダをすべてキャッシュに登録
      let currentKey = "";
      for (let i = 0; i < parts.length - 1; i++) {
        const parentKey = currentKey;
        currentKey = currentKey ? `${currentKey}/${parts[i]}` : parts[i];

        if (!cache.has(currentKey)) {
          cache.set(currentKey, []);
          const parentList = cache.get(parentKey);
          if (parentList) {
            parentList.push(new FolderItem(parts[i], currentKey));
          }
        }
      }

      // ファイルを親フォルダに追加
      const fileName = parts[parts.length - 1];
      const parentKey = parts.slice(0, -1).join("/");
      const fileItem = new FileItem(fileName, charset, {
        command: "viewcharset.openFile",
        title: "Open File",
        arguments: [absolutePath],
      });

      const parentList = cache.get(parentKey);
      if (parentList) {
        parentList.push(fileItem);
      }
    }

    // 各階層をソート: フォルダ優先、その後ファイル。各グループ内は ABC 順
    for (const children of cache.values()) {
      children.sort((a, b) => {
        const aIsFolder = a instanceof FolderItem ? 0 : 1;
        const bIsFolder = b instanceof FolderItem ? 0 : 1;
        if (aIsFolder !== bIsFolder) { return aIsFolder - bIsFolder; }
        return (a.label as string).localeCompare(b.label as string);
      });
    }

    return cache;
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
      ".yml",
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
      const pattern = `**/*{${fileExtensions.join(",")}}`;
      const exclude = `{${excludePatterns.join(",")}}`;

      this.logger.debug("Searching for files", { pattern, exclude });

      const uris = await vscode.workspace.findFiles(pattern, exclude);
      this.logger.debug("Found files", { count: uris.length });

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
        files,
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

  public shouldProcessFile(filePath: string): boolean {
    return this.charsetDetector.shouldProcessFile(filePath);
  }
}

class FolderItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    /** ワークスペースルートからの相対パス（/ 区切り） */
    public readonly folderKey: string
  ) {
    super(label, vscode.TreeItemCollapsibleState.Collapsed);
    this.tooltip = folderKey;
    this.iconPath = new vscode.ThemeIcon("folder");
    this.contextValue = "folder";
  }
}

class FileItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    charset: string,
    public readonly command?: vscode.Command
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.tooltip = `${this.label} (${charset})`;
    this.description = charset;
    this.iconPath = new vscode.ThemeIcon("file");
    this.contextValue = "file";
  }
}
