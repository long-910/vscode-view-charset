import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as encoding from 'encoding-japanese';
import { CharsetTreeDataProvider } from './TreeDataProvider';
import * as nls from 'vscode-nls';

const localize = nls.config({ messageFormat: nls.MessageFormat.bundle })();

export async function activate(context: vscode.ExtensionContext) {
    // ワークスペース内のファイルデータを取得
    const fileData = await getWorkspaceFileData();

    // TreeDataProviderの登録
    const treeDataProvider = new CharsetTreeDataProvider(fileData);
    vscode.window.registerTreeDataProvider('viewcharset', treeDataProvider);

    // コマンドの登録
    registerCommands(context, treeDataProvider, fileData);

    const commandId = 'viewCharset.openWebView';
    const command = vscode.commands.registerCommand(commandId, () => {
        vscode.window.showInformationMessage(localize('command.openWebView', 'Open View Charset Web View'));
    });

    context.subscriptions.push(command);
}

export function deactivate() {}

/**
 * ワークスペース内の全ファイルを取得し、文字コードを検出する
 */
async function getWorkspaceFileData(): Promise<{ fileName: string; charset: string }[]> {
    const fileData: { fileName: string; charset: string }[] = [];
    if (vscode.workspace.workspaceFolders) {
        const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
        const files = await vscode.workspace.findFiles('**/*'); // 非同期処理を待つ

        for (const file of files) {
            const filePath = file.fsPath;
            try {
                const buffer = fs.readFileSync(filePath);
                const detected = encoding.detect(buffer); // 文字コードを検出
                fileData.push({
                    fileName: path.relative(workspaceFolder, filePath),
                    charset: detected ? detected.toString() : '不明',
                });
            } catch (error) {
                console.error(`Error reading file ${filePath}:`, error);
            }
        }
    }
    return fileData;
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
