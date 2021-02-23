import * as vscode from 'vscode';
import { Provider} from './provider';

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {

	console.log('extension "vscode-view-charset" is now active!');

	vscode.window.createTreeView('viewcharset', {
		treeDataProvider: new Provider(vscode.workspace.workspaceFolders[0].uri.path)
	});
}

// this method is called when your extension is deactivated
export function deactivate() {}
