import * as vscode from 'vscode';
import {RgisterTreeDataProvider} from './provider';

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {

	if (vscode.workspace.workspaceFolders !== undefined) {
		let regProvider  = new RgisterTreeDataProvider('viewcharset', vscode.workspace.workspaceFolders[0].uri.fsPath, 'viewcharset.openfile');
	}
}

// this method is called when your extension is deactivated
export function deactivate() {}
