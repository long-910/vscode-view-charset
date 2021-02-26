import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

var encoding = require('encoding-japanese');

export class RgisterTreeDataProvider {

  constructor(id: string, rootPath: string, command: string) {
    this.registerTree(id, rootPath, command);
  }

  registerTree(id: string, rootPath: string, command: string) {
    let provider = new Provider(rootPath, command);

    vscode.window.createTreeView(id, {treeDataProvider: provider});

    setInterval(() => {
      provider.refresh();
    }, 1000);
  }
}

export class Provider implements vscode.TreeDataProvider<TreeItem> {

  protected _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | void> = new vscode.EventEmitter<TreeItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | void> = this._onDidChangeTreeData.event;

  constructor(protected rootPath: string, protected cmd: string) {
    vscode.commands.registerCommand(cmd, (resource) =>
      this.openResource(resource)
    );
  }

  protected openResource(resource: vscode.Uri): void {
    vscode.window.showTextDocument(resource);
  }

  getTreeItem(element: TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: TreeItem): Thenable<TreeItem[]> {

    if (!this.rootPath || !fs.existsSync(this.rootPath)){
      return Promise.resolve([]);
    }

    if (!element){
      return Promise.resolve(this.getItem(this.rootPath));
    }else{
      return Promise.resolve(this.getItem(element.itemPath));
    }
  }

  isDir(path : string) {

    let stat = fs.statSync(path);

    if (stat.isDirectory()) {
      return true;
    }

    return false;
  }

  getItem(rootPath: string): TreeItem[] {

    if (!this.isDir(rootPath)) {
      return [];
    }

    let dir = fs.readdirSync(rootPath);
    let dirTreeItem: TreeItem[] = [];

    dir.forEach((itemElement) => {

      const itemPath: string = path.join(rootPath, itemElement);
      const collapsible: vscode.TreeItemCollapsibleState = this.isDir(itemPath) ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None;

      if (this.isDir(itemPath)) {

        dirTreeItem.push(
          new TreeItem(itemElement, itemPath, '', collapsible)
        );

      } else {

        let command = {
          command: this.cmd,
          title: "Open File",
          arguments: [vscode.Uri.file(itemPath)],
        };

        let fileBuffer = fs.readFileSync(itemPath);
        let fileEncoding = encoding.detect(fileBuffer);

        dirTreeItem.push(
          new TreeItem(itemElement, itemPath, fileEncoding, collapsible, command)
        );

      }
    });

    return dirTreeItem;
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

class TreeItem extends vscode.TreeItem {
  children: TreeItem[]| undefined;

  constructor(
    public readonly label: string,
    private _itemPath: string,
    private _charset: string,
    state: vscode.TreeItemCollapsibleState,
    private _itemCommand?: vscode.Command
    ) {
    super(label, state);
  }

  get itemPath(): string {
    return this._itemPath;
  }

  description = this._charset;
  resourceUri = vscode.Uri.file(this.itemPath);
  command = this._itemCommand;
}
