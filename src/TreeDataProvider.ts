import * as vscode from 'vscode';

export class CharsetTreeDataProvider implements vscode.TreeDataProvider<CharsetItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<CharsetItem | undefined | void> = new vscode.EventEmitter<CharsetItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<CharsetItem | undefined | void> = this._onDidChangeTreeData.event;

    private items: CharsetItem[] = [];

    constructor(fileData: { fileName: string; charset: string }[]) {
        this.refresh(fileData);
    }

    refresh(fileData: { fileName: string; charset: string }[]): void {
        this.items = fileData.map(data => new CharsetItem(data.fileName, data.charset));
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: CharsetItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: CharsetItem): Thenable<CharsetItem[]> {
        if (element) {
            return Promise.resolve([]);
        } else {
            return Promise.resolve(this.items);
        }
    }
}

class CharsetItem extends vscode.TreeItem {
    constructor(public readonly fileName: string, public readonly charset: string) {
        super(fileName, vscode.TreeItemCollapsibleState.None);
        this.description = charset;
    }
}
