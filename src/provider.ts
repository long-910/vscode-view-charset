import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

var encoding = require('encoding-japanese');
export class Provider implements vscode.TreeDataProvider<TreeItem> {

  constructor(private workspaceRoot: string) {
  }

  getTreeItem(element: TreeItem): vscode.TreeItem|Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(element?: TreeItem|undefined): vscode.ProviderResult<TreeItem[]> {
    if(!this.workspaceRoot){
      return Promise.resolve([]);
    }

    if(element === undefined){
      return Promise.resolve(this.getFiles(this.workspaceRoot));
    }else{
      return Promise.resolve(this.getFiles(path.join(element.parentPath, element.label)));
    }
  }

  private getFiles(parentPath: string): TreeItem[] {
    let treeItem: TreeItem[] = [];

    if(this.pathExists(parentPath)){
        let readDir = fs.readdirSync(parentPath);

        readDir.forEach(fileName => {
          let filePath: string = path.join(parentPath, fileName);
          let fileColState: vscode.TreeItemCollapsibleState;
          let fileEncoding: string;

          if(fs.statSync(filePath).isDirectory()){
            fileColState = vscode.TreeItemCollapsibleState.Collapsed;
          }else{
            fileColState = vscode.TreeItemCollapsibleState.None;

            let fileBuffer = fs.readFileSync(filePath);
            fileEncoding = encoding.detect(fileBuffer);

            fileName = fileName + ': ' + fileEncoding;
          }

          treeItem.push(new TreeItem(fileName, parentPath, fileColState));
        });
    }
    return treeItem;
  }

  private pathExists(p: string): boolean {
    try {
      fs.accessSync(p);
    } catch (err) {
      return false;
    }
    return true;
  }
}

class TreeItem extends vscode.TreeItem {
  children: TreeItem[]| undefined;

  constructor(
    public readonly label: string,
    public readonly parentPath: string,
    public readonly collapsibaleState: vscode.TreeItemCollapsibleState
    ) {
    super(label, collapsibaleState);
  }
}
