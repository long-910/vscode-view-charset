import * as vscode from 'vscode';
import * as path from 'path';
import { CharsetDetector } from "./charsetDetector";

interface FileInfo {
  path: string;
  encoding: string;
}

export class ViewCharsetWebview {
  private files: FileInfo[] = [];
  private panel: vscode.WebviewPanel | undefined;

  constructor(private context: vscode.ExtensionContext) {}

  public async refresh() {
    const charsetDetector = CharsetDetector.getInstance();
    this.files = await charsetDetector.detectWorkspaceFiles();
    if (this.panel) {
      this.panel.webview.html = this.getWebviewContent(this.panel.webview);
    }
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  private getWebviewContent(webview: vscode.Webview): string {
    const encodingCounts: Record<string, number> = {};
    for (const file of this.files) {
      encodingCounts[file.encoding] = (encodingCounts[file.encoding] ?? 0) + 1;
    }
    const summaryItems = Object.entries(encodingCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([enc, count]) => `<span class="badge">${this.escapeHtml(enc)}: ${count}</span>`)
      .join(' ');

    const rows = this.files.length > 0
      ? this.files.map(file => `
          <tr>
            <td>${this.escapeHtml(file.path)}</td>
            <td>${this.escapeHtml(file.encoding)}</td>
          </tr>
        `).join('')
      : '<tr><td colspan="2" class="no-files">No files found</td></tr>';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
  <title>View Charset</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe WPC', 'Segoe UI', system-ui, 'Ubuntu', 'Droid Sans', sans-serif;
      padding: 20px;
      color: var(--vscode-editor-foreground);
      background-color: var(--vscode-editor-background);
    }
    .toolbar {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }
    .button {
      background-color: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      padding: 6px 14px;
      font-size: 13px;
      cursor: pointer;
      border-radius: 2px;
    }
    .button:hover {
      background-color: var(--vscode-button-hoverBackground);
    }
    .search-box {
      background-color: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border: 1px solid var(--vscode-input-border, #ccc);
      padding: 5px 10px;
      font-size: 13px;
      border-radius: 2px;
      width: 260px;
    }
    .search-box:focus {
      outline: 1px solid var(--vscode-focusBorder);
    }
    .summary {
      margin-bottom: 12px;
      font-size: 12px;
      color: var(--vscode-descriptionForeground);
    }
    .badge {
      display: inline-block;
      background: var(--vscode-badge-background);
      color: var(--vscode-badge-foreground);
      border-radius: 10px;
      padding: 1px 8px;
      margin: 2px;
      font-size: 11px;
    }
    #fileCount {
      font-weight: 600;
      margin-right: 8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 4px;
    }
    th, td {
      border: 1px solid var(--vscode-panel-border);
      padding: 6px 10px;
      text-align: left;
    }
    th {
      background-color: var(--vscode-editor-lineHighlightBackground);
      cursor: pointer;
      user-select: none;
      white-space: nowrap;
    }
    th:hover {
      background-color: var(--vscode-list-hoverBackground);
    }
    th .sort-icon {
      margin-left: 4px;
      opacity: 0.5;
      font-size: 10px;
    }
    th.sorted .sort-icon {
      opacity: 1;
    }
    tr:nth-child(even) {
      background-color: var(--vscode-editor-lineHighlightBackground);
    }
    tr.hidden {
      display: none;
    }
    .no-files {
      text-align: center;
      color: var(--vscode-descriptionForeground);
      padding: 20px;
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <button class="button" id="exportCsv">Export to CSV</button>
    <input class="search-box" type="search" id="searchBox" placeholder="Filter by path or encoding..." />
  </div>
  <div class="summary">
    <span id="fileCount">Total: ${this.files.length} files</span>
    ${summaryItems}
  </div>
  <table id="fileTable">
    <thead>
      <tr>
        <th data-col="0">File <span class="sort-icon">&#9650;</span></th>
        <th data-col="1">Encoding <span class="sort-icon">&#9650;</span></th>
      </tr>
    </thead>
    <tbody id="tableBody">
      ${rows}
    </tbody>
  </table>
  <script>
    const vscode = acquireVsCodeApi();

    // CSV export
    document.getElementById('exportCsv').addEventListener('click', () => {
      vscode.postMessage({ command: 'exportCsv' });
    });

    // Sort
    let sortCol = -1;
    let sortAsc = true;
    document.querySelectorAll('th[data-col]').forEach(th => {
      th.addEventListener('click', () => {
        const col = parseInt(th.getAttribute('data-col'));
        if (sortCol === col) {
          sortAsc = !sortAsc;
        } else {
          sortCol = col;
          sortAsc = true;
        }
        document.querySelectorAll('th').forEach(h => {
          h.classList.remove('sorted');
          const icon = h.querySelector('.sort-icon');
          if (icon) icon.innerHTML = '&#9650;';
        });
        th.classList.add('sorted');
        const icon = th.querySelector('.sort-icon');
        if (icon) icon.innerHTML = sortAsc ? '&#9650;' : '&#9660;';
        sortTable(col, sortAsc);
      });
    });

    function sortTable(col, asc) {
      const tbody = document.getElementById('tableBody');
      const rows = Array.from(tbody.querySelectorAll('tr:not(.hidden)'));
      const hiddenRows = Array.from(tbody.querySelectorAll('tr.hidden'));
      rows.sort((a, b) => {
        const aText = a.cells[col]?.textContent?.trim() ?? '';
        const bText = b.cells[col]?.textContent?.trim() ?? '';
        return asc ? aText.localeCompare(bText) : bText.localeCompare(aText);
      });
      rows.forEach(r => tbody.appendChild(r));
      hiddenRows.forEach(r => tbody.appendChild(r));
    }

    // Filter
    const searchBox = document.getElementById('searchBox');
    const fileCountEl = document.getElementById('fileCount');
    searchBox.addEventListener('input', () => {
      const query = searchBox.value.toLowerCase();
      const rows = document.querySelectorAll('#tableBody tr');
      let visible = 0;
      rows.forEach(row => {
        const text = row.textContent?.toLowerCase() ?? '';
        if (!query || text.includes(query)) {
          row.classList.remove('hidden');
          visible++;
        } else {
          row.classList.add('hidden');
        }
      });
      fileCountEl.textContent = query
        ? 'Showing: ' + visible + ' / ${this.files.length} files'
        : 'Total: ${this.files.length} files';
    });
  </script>
</body>
</html>`;
  }

  private handleWebviewMessage(message: { command: string }) {
    switch (message.command) {
      case 'exportCsv':
        this.exportToCsv();
        break;
    }
  }

  private csvQuote(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return '"' + value.replace(/"/g, '""') + '"';
    }
    return value;
  }

  private async exportToCsv() {
    try {
      const uri = await vscode.window.showSaveDialog({
        filters: { 'CSV Files': ['csv'] },
        defaultUri: vscode.Uri.file('charset_export.csv')
      });

      if (!uri) {
        return;
      }

      const csvContent = [
        ['Path', 'Filename', 'Encoding'].map(h => this.csvQuote(h)).join(','),
        ...this.files.map(file => {
          const normalized = file.path.replace(/\\/g, '/');
          const lastSlash = normalized.lastIndexOf('/');
          const dirPath = lastSlash > 0 ? normalized.substring(0, lastSlash) : '';
          const filename = lastSlash > 0 ? normalized.substring(lastSlash + 1) : normalized;
          return [dirPath, filename, file.encoding].map(v => this.csvQuote(v)).join(',');
        })
      ].join('\n');

      await vscode.workspace.fs.writeFile(uri, Buffer.from('\uFEFF' + csvContent, 'utf8'));
      vscode.window.showInformationMessage('CSV exported successfully!');
    } catch (error) {
      vscode.window.showErrorMessage('Failed to export CSV: ' + error);
    }
  }

  public show() {
    if (this.panel) {
      this.panel.reveal(vscode.ViewColumn.One);
      return;
    }

    this.panel = vscode.window.createWebviewPanel(
      'viewCharset',
      'View Charset',
      vscode.ViewColumn.One,
      { enableScripts: true }
    );

    this.panel.onDidDispose(() => {
      this.panel = undefined;
    }, undefined, this.context.subscriptions);

    this.panel.webview.html = this.getWebviewContent(this.panel.webview);

    this.panel.webview.onDidReceiveMessage(
      message => this.handleWebviewMessage(message),
      undefined,
      this.context.subscriptions
    );
  }
}
