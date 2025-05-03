import * as vscode from 'vscode';
import { CharsetDetector } from "./charsetDetector";

interface FileInfo {
  path: string;
  encoding: string;
}

export class ViewCharsetWebview {
  private files: FileInfo[] = [];

  constructor(private context: vscode.ExtensionContext) {}

  public async refresh() {
    const charsetDetector = CharsetDetector.getInstance();
    this.files = await charsetDetector.detectWorkspaceFiles();
  }

  private getWebviewContent(webview: vscode.Webview): string {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>View Charset</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe WPC', 'Segoe UI', system-ui, 'Ubuntu', 'Droid Sans', sans-serif;
          padding: 20px;
          color: var(--vscode-editor-foreground);
          background-color: var(--vscode-editor-background);
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid var(--vscode-panel-border);
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: var(--vscode-editor-lineHighlightBackground);
        }
        tr:nth-child(even) {
          background-color: var(--vscode-editor-lineHighlightBackground);
        }
        .button {
          background-color: var(--vscode-button-background);
          color: var(--vscode-button-foreground);
          border: none;
          padding: 8px 16px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 14px;
          margin: 4px 2px;
          cursor: pointer;
          border-radius: 2px;
        }
        .button:hover {
          background-color: var(--vscode-button-hoverBackground);
        }
        .button-container {
          margin-bottom: 20px;
          display: flex;
          gap: 10px;
        }
      </style>
    </head>
    <body>
      <div class="button-container">
        <button class="button" id="exportCsv">Export to CSV</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>File</th>
            <th>Encoding</th>
          </tr>
        </thead>
        <tbody>
          ${this.files.length > 0 
            ? this.files.map(file => `
              <tr>
                <td>${file.path}</td>
                <td>${file.encoding}</td>
              </tr>
            `).join('')
            : '<tr><td colspan="2">No files found</td></tr>'
          }
        </tbody>
      </table>
      <script>
        const vscode = acquireVsCodeApi();
        
        document.getElementById('exportCsv').addEventListener('click', () => {
          vscode.postMessage({
            command: 'exportCsv'
          });
        });
      </script>
    </body>
    </html>`;
  }

  private handleWebviewMessage(message: any) {
    switch (message.command) {
      case 'exportCsv':
        this.exportToCsv();
        break;
    }
  }

  private async exportToCsv() {
    try {
      const uri = await vscode.window.showSaveDialog({
        filters: {
          'CSV Files': ['csv']
        },
        defaultUri: vscode.Uri.file('charset_export.csv')
      });

      if (!uri) {
        return;
      }

      const csvContent = [
        ['Path', 'Filename', 'Encoding'].join(','),
        ...this.files.map(file => {
          const path = file.path.replace(/\\/g, '/');
          const lastSlashIndex = path.lastIndexOf('/');
          const dirPath = lastSlashIndex > 0 ? path.substring(0, lastSlashIndex) : '';
          const filename = lastSlashIndex > 0 ? path.substring(lastSlashIndex + 1) : path;
          return [dirPath, filename, file.encoding].join(',');
        })
      ].join('\n');

      await vscode.workspace.fs.writeFile(uri, Buffer.from(csvContent));
      vscode.window.showInformationMessage('CSV exported successfully!');
    } catch (error) {
      vscode.window.showErrorMessage('Failed to export CSV: ' + error);
    }
  }

  public updateFiles(files: FileInfo[]) {
    this.files = files;
  }

  public async show() {
    const panel = vscode.window.createWebviewPanel(
      'viewCharset',
      'View Charset',
      vscode.ViewColumn.One,
      {
        enableScripts: true
      }
    );

    await this.refresh();
    panel.webview.html = this.getWebviewContent(panel.webview);

    panel.webview.onDidReceiveMessage(
      message => this.handleWebviewMessage(message),
      undefined,
      this.context.subscriptions
    );
  }
} 
