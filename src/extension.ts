import * as vscode from 'vscode';
import { Provider} from './provider';

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {

	console.log('extension "vscode-view-charset" is now active!');

	if (vscode.workspace.workspaceFolders !== undefined) {
		vscode.window.createTreeView('viewcharset', {
			treeDataProvider: new Provider(vscode.workspace.workspaceFolders[0].uri.fsPath)
		});
	}
}

// this method is called when your extension is deactivated
export function deactivate() {}
