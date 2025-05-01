import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as encoding from 'encoding-japanese';
import { CharsetTreeDataProvider } from './TreeDataProvider';
import * as nls from 'vscode-nls';

const localize = nls.config({ messageFormat: nls.MessageFormat.bundle })();

// グローバル変数
let treeDataProvider: CharsetTreeDataProvider;

// キャッシュ用のインターフェース
interface CacheItem {
    charset: string;
    timestamp: number;
}

// キャッシュストア
class CacheStore {
    private cache: Map<string, CacheItem> = new Map();
    private cacheDuration: number;

    constructor(cacheDuration: number) {
        this.cacheDuration = cacheDuration;
    }

    get(filePath: string): string | null {
        const item = this.cache.get(filePath);
        if (!item) return null;

        const now = Date.now();
        if (now - item.timestamp > this.cacheDuration * 1000) {
            this.cache.delete(filePath);
            return null;
        }

        return item.charset;
    }

    set(filePath: string, charset: string): void {
        this.cache.set(filePath, {
            charset,
            timestamp: Date.now()
        });
    }

    clear(): void {
        this.cache.clear();
    }
}

export async function activate(context: vscode.ExtensionContext) {
    // 設定の変更を監視
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('viewCharset')) {
                // 設定が変更されたらキャッシュをクリア
                cacheStore.clear();
                // Tree Viewを更新
                refreshTreeView();
            }
        })
    );

    // ワークスペース内のファイルデータを取得
    const fileData = await getWorkspaceFileData();

    // TreeDataProviderの登録
    treeDataProvider = new CharsetTreeDataProvider(fileData);
    vscode.window.registerTreeDataProvider('viewcharset', treeDataProvider);

    // コマンドの登録
    registerCommands(context, treeDataProvider, fileData);

    const commandId = 'viewCharset.openWebView';
    const command = vscode.commands.registerCommand(commandId, () => {
        vscode.window.showInformationMessage(localize('command.openWebView', 'Open View Charset Web View'));
    });

    context.subscriptions.push(command);
}

// キャッシュストアのインスタンス化
const config = vscode.workspace.getConfiguration('viewCharset');
const cacheStore = new CacheStore(config.get('cacheDuration', 3600));

// Tree Viewを更新する関数
async function refreshTreeView() {
    const fileData = await getWorkspaceFileData();
    treeDataProvider.refresh(fileData);
}

/**
 * ワークスペース内の全ファイルを取得し、文字コードを検出する
 */
async function getWorkspaceFileData(): Promise<{ fileName: string; charset: string }[]> {
    if (!vscode.workspace.workspaceFolders) {
        return [];
    }

    const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
    const config = vscode.workspace.getConfiguration('viewCharset');
    const fileExtensions = config.get<string[]>('fileExtensions', []);
    const maxFileSize = config.get<number>('maxFileSize', 1024) * 1024; // KB to bytes
    const cacheEnabled = config.get<boolean>('cacheEnabled', true);

    // ファイルパターンの作成
    const pattern = `**/*.{${fileExtensions.join(',')}}`;
    const files = await vscode.workspace.findFiles(pattern);

    if (files.length === 0) {
        return [];
    }

    // プログレス表示の開始
    const progressOptions: vscode.ProgressOptions = {
        location: vscode.ProgressLocation.Notification,
        title: localize('progress.title', '文字コードを検出中...'),
        cancellable: true
    };

    return vscode.window.withProgress(progressOptions, async (progress, token) => {
        const total = files.length;
        let processed = 0;
        const results: { fileName: string; charset: string }[] = [];

        // 並列処理でファイルを読み込む
        const promises = files.map(async (file) => {
            if (token.isCancellationRequested) {
                return null;
            }

            const filePath = file.fsPath;
            try {
                // キャッシュの確認
                if (cacheEnabled) {
                    const cachedCharset = cacheStore.get(filePath);
                    if (cachedCharset) {
                        return {
                            fileName: path.relative(workspaceFolder, filePath),
                            charset: cachedCharset
                        };
                    }
                }

                // 非同期でファイルを読み込む
                const buffer = await fs.promises.readFile(filePath);

                // ファイルサイズチェック
                if (buffer.length > maxFileSize) {
                    return null;
                }

                const detected = encoding.detect(buffer);
                const charset = detected ? detected.toString() : '不明';

                // キャッシュに保存
                if (cacheEnabled) {
                    cacheStore.set(filePath, charset);
                }

                return {
                    fileName: path.relative(workspaceFolder, filePath),
                    charset
                };
            } catch (error) {
                console.error(`Error reading file ${filePath}:`, error);
                return null;
            } finally {
                processed++;
                progress.report({ message: `${processed}/${total}`, increment: 1 });
            }
        });

        // 全てのPromiseを待機し、nullでない結果のみをフィルタリング
        const fileData = await Promise.all(promises);
        return fileData.filter((result): result is { fileName: string; charset: string } => result !== null);
    });
}

/**
 * コマンドを登録する
 */
function registerCommands(
    context: vscode.ExtensionContext,
    treeDataProvider: CharsetTreeDataProvider,
    fileData: { fileName: string; charset: string }[]
) {
    const openWebViewCommand = vscode.commands.registerCommand('viewcharset.openWebView', async () => {
        const panel = vscode.window.createWebviewPanel(
            'viewCharsetWebView',
            'View Charset - Web View',
            vscode.ViewColumn.One,
            {
                enableScripts: true, // JavaScriptを有効化
            }
        );

        // WebビューのHTMLコンテンツを設定
        panel.webview.html = getWebviewContent();

        // 動的データを送信
        panel.webview.postMessage({ command: 'update', data: fileData });

        // Tree Viewを更新
        treeDataProvider.refresh(fileData);
    });

    context.subscriptions.push(openWebViewCommand);
}

/**
 * WebビューのHTMLコンテンツを生成する
 */
function getWebviewContent(): string {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>View Charset</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
                header { background-color: #007acc; color: white; padding: 10px; text-align: center; }
                main { padding: 20px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f4f4f4; }
            </style>
        </head>
        <body>
            <header>
                <h1>View Charset</h1>
            </header>
            <main>
                <p>ワークスペース内のファイルと文字コードを表示します。</p>
                <table>
                    <thead>
                        <tr>
                            <th>ファイル名</th>
                            <th>文字コード</th>
                        </tr>
                    </thead>
                    <tbody id="file-data">
                        <!-- 動的データがここに挿入されます -->
                    </tbody>
                </table>
            </main>
            <script>
                // メッセージを受信してデータを表示
                window.addEventListener('message', event => {
                    const message = event.data;
                    if (message.command === 'update') {
                        const tableBody = document.getElementById('file-data');
                        tableBody.innerHTML = ''; // 既存のデータをクリア
                        message.data.forEach(file => {
                            const row = document.createElement('tr');
                            row.innerHTML = \`
                                <td>\${file.fileName}</td>
                                <td>\${file.charset}</td>
                            \`;
                            tableBody.appendChild(row);
                        });
                    }
                });
            </script>
        </body>
        </html>
    `;
}
