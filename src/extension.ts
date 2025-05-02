import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as encoding from "encoding-japanese";
import { CharsetTreeDataProvider } from "./TreeDataProvider";
import * as nls from "vscode-nls";
import { Logger } from "./logger";

// 多言語化の設定
const localize = nls.config({
  messageFormat: nls.MessageFormat.file,
  locale: vscode.env.language,
})();

// ロガーの初期化
const logger = Logger.getInstance();

// キャッシュの型定義
interface CacheEntry {
  charset: string;
  timestamp: number;
}

// キャッシュの管理
class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, CacheEntry> = new Map();
  private readonly config = vscode.workspace.getConfiguration("viewCharset");
  private readonly cacheDuration =
    this.config.get<number>("cacheDuration", 3600) * 1000;

  private constructor() {}

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  public get(filePath: string): string | null {
    const entry = this.cache.get(filePath);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.cacheDuration) {
      this.cache.delete(filePath);
      return null;
    }

    return entry.charset;
  }

  public set(filePath: string, charset: string): void {
    this.cache.set(filePath, {
      charset,
      timestamp: Date.now(),
    });
  }

  public clear(): void {
    this.cache.clear();
  }
}

// 文字コード検出の管理
export class CharsetDetector {
  private static instance: CharsetDetector;
  private readonly config = vscode.workspace.getConfiguration("viewCharset");
  private readonly maxFileSize =
    this.config.get<number>("maxFileSize", 1024) * 1024;
  private readonly fileExtensions = this.config.get<string[]>(
    "fileExtensions",
    [".txt", ".csv", ".tsv", ".json", ".xml", ".html", ".css", ".js", ".ts"]
  );
  private readonly excludePatterns = this.config.get<string[]>(
    "excludePatterns",
    ["**/node_modules/**", "**/.git/**"]
  );
  private readonly logger: Logger;

  private constructor() {
    this.logger = Logger.getInstance();
    this.logger.debug("CharsetDetector initialized", {
      maxFileSize: this.maxFileSize,
      fileExtensions: this.fileExtensions,
      excludePatterns: this.excludePatterns,
    });
  }

  public static getInstance(): CharsetDetector {
    if (!CharsetDetector.instance) {
      CharsetDetector.instance = new CharsetDetector();
    }
    return CharsetDetector.instance;
  }

  public async detectCharset(filePath: string): Promise<string> {
    const cacheManager = CacheManager.getInstance();
    const cachedCharset = cacheManager.get(filePath);
    if (cachedCharset) {
      return cachedCharset;
    }

    try {
      const stats = await fs.promises.stat(filePath);
      if (stats.size > this.maxFileSize) {
        return "File too large";
      }

      const buffer = await fs.promises.readFile(filePath);
      if (buffer.length === 0) {
        return "Empty file";
      }

      // 文字コードの検出
      const detected = encoding.detect(buffer);
      if (!detected) {
        return "Unknown";
      }

      const charset = Array.isArray(detected) ? detected[0] : detected;
      cacheManager.set(filePath, charset);
      return charset;
    } catch (error) {
      this.logger.error("Error detecting charset", { filePath, error });
      return "Error";
    }
  }

  public shouldProcessFile(filePath: string): boolean {
    try {
      this.logger.debug("Checking file", { filePath });

      // ファイルが存在するか確認
      if (!fs.existsSync(filePath)) {
        this.logger.debug("File does not exist", { filePath });
        return false;
      }

      // ファイルサイズを確認
      const stats = fs.statSync(filePath);
      if (stats.size > this.maxFileSize) {
        this.logger.debug("File too large", {
          filePath,
          size: stats.size,
          maxSize: this.maxFileSize,
        });
        return false;
      }

      // 除外パターンのチェック
      for (const pattern of this.excludePatterns) {
        const normalizedPattern = pattern
          .replace(/\\/g, "/")
          .replace(/\*\*/g, ".*")
          .replace(/\*/g, "[^/]*");
        const regex = new RegExp(normalizedPattern);
        const normalizedPath = filePath.replace(/\\/g, "/");

        this.logger.debug("Checking exclude pattern", {
          filePath,
          pattern,
          normalizedPattern,
          normalizedPath,
          matches: regex.test(normalizedPath),
        });

        if (regex.test(normalizedPath)) {
          this.logger.debug("File excluded by pattern", {
            filePath,
            pattern,
            normalizedPattern,
            normalizedPath,
          });
          return false;
        }
      }

      this.logger.debug("File passed all checks", { filePath });
      return true;
    } catch (error) {
      this.logger.error("Error checking file", {
        filePath,
        error,
        errorMessage: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }
}

export function activate(context: vscode.ExtensionContext) {
  logger.info("Activating View Charset extension");

  const treeDataProvider = new CharsetTreeDataProvider();
  const charsetDetector = CharsetDetector.getInstance();

  // ツリービューの登録
  const treeView = vscode.window.createTreeView("viewcharset", {
    treeDataProvider,
    showCollapseAll: true,
  });

  // コマンドの登録
  context.subscriptions.push(
    vscode.commands.registerCommand("viewcharset.openWebView", async () => {
      const panel = vscode.window.createWebviewPanel(
        "viewCharsetWebView",
        localize("webview.title", "View Charset - Web View"),
        vscode.ViewColumn.One,
        {
          enableScripts: true,
        }
      );

      // ファイルデータを取得
      const workspaceFolder =
        vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
      if (!workspaceFolder) {
        panel.webview.html = getWebviewContent([]);
        return;
      }

      const files = await treeDataProvider.getWorkspaceFiles(workspaceFolder);
      const fileData = await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(workspaceFolder, file);
          const charset = await charsetDetector.detectCharset(filePath);
          return { fileName: file, charset };
        })
      );

      panel.webview.html = getWebviewContent(fileData);
    }),
    vscode.commands.registerCommand(
      "viewcharset.openFile",
      async (filePath: string) => {
        try {
          const document = await vscode.workspace.openTextDocument(filePath);
          await vscode.window.showTextDocument(document);
          logger.info("Opened file", { filePath });
        } catch (error) {
          logger.error("Failed to open file", { filePath, error });
          vscode.window.showErrorMessage(
            localize("command.openFile.error.general", "Failed to open file")
          );
        }
      }
    )
  );

  // 設定変更の監視
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("viewCharset")) {
        CacheManager.getInstance().clear();
        treeDataProvider.refresh();
      }
    })
  );

  // ファイル変更の監視
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((document) => {
      if (charsetDetector.shouldProcessFile(document.fileName)) {
        treeDataProvider.refresh();
      }
    })
  );

  // 初期表示
  treeDataProvider.refresh();
}

function getWebviewContent(
  fileData: { fileName: string; charset: string }[]
): string {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>File Charset Information</title>
      <style>
          body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              padding: 20px;
              color: var(--vscode-foreground);
              background-color: var(--vscode-editor-background);
          }
          table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
          }
          th, td {
              padding: 8px;
              text-align: left;
              border-bottom: 1px solid var(--vscode-panel-border);
          }
          th {
              background-color: var(--vscode-panel-background);
              font-weight: bold;
          }
          tr:hover {
              background-color: var(--vscode-list-hoverBackground);
          }
          .no-files {
              text-align: center;
              padding: 20px;
              color: var(--vscode-descriptionForeground);
          }
      </style>
  </head>
  <body>
      <h2>File Charset Information</h2>
      ${
        fileData.length > 0
          ? `
          <table>
              <thead>
                  <tr>
                      <th>File Name</th>
                      <th>Charset</th>
                  </tr>
              </thead>
              <tbody>
                  ${fileData
                    .map(
                      (file) => `
                      <tr>
                          <td>${file.fileName}</td>
                          <td>${file.charset}</td>
                      </tr>
                  `
                    )
                    .join("")}
              </tbody>
          </table>
      `
          : `
          <div class="no-files">
              No files found in the workspace.
          </div>
      `
      }
  </body>
  </html>`;
}

export function deactivate() {
  logger.info("Deactivating View Charset extension");
}
