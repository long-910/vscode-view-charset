import * as vscode from "vscode";
import { CharsetTreeDataProvider } from "./TreeDataProvider";
import { CharsetDetector } from "./charsetDetector";
import * as nls from "vscode-nls";
import { Logger } from "./logger";
import { ViewCharsetWebview } from './webview';

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
    if (!entry) { return null; }

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

export function activate(context: vscode.ExtensionContext) {
  logger.info("Activating View Charset extension");

  const treeDataProvider = new CharsetTreeDataProvider();
  const charsetDetector = CharsetDetector.getInstance();
  let webview: ViewCharsetWebview | undefined;
  let saveDebounceTimer: ReturnType<typeof setTimeout> | undefined;

  // ツリービューの登録
  const treeView = vscode.window.createTreeView("viewcharset", {
    treeDataProvider,
    showCollapseAll: true,
  });
  context.subscriptions.push(treeView);

  // コマンドの登録
  context.subscriptions.push(
    vscode.commands.registerCommand("viewcharset.openWebView", async () => {
      try {
        if (!webview) {
          webview = new ViewCharsetWebview(context);
        }
        await webview.refresh();
        webview.show();
      } catch (error) {
        logger.error('Failed to open WebView', { error });
        vscode.window.showErrorMessage('Failed to open WebView: ' + error);
      }
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
        webview?.refresh();
      }
    })
  );

  // ファイル変更の監視（デバウンス付き）
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((document) => {
      if (charsetDetector.shouldProcessFile(document.fileName)) {
        if (saveDebounceTimer) {
          clearTimeout(saveDebounceTimer);
        }
        saveDebounceTimer = setTimeout(() => {
          treeDataProvider.refresh();
          webview?.refresh();
          saveDebounceTimer = undefined;
        }, 500);
      }
    })
  );

  // 初期表示
  treeDataProvider.refresh();
}

export function deactivate() {
  logger.info("Deactivating View Charset extension");
  logger.dispose();
}
