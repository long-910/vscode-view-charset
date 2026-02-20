import * as path from 'path';

import { runTests } from 'vscode-test';

async function main() {
	try {
		// The folder containing the Extension Manifest package.json
		// Passed to `--extensionDevelopmentPath`
		const extensionDevelopmentPath = path.resolve(__dirname, '../../');

		// The path to test runner
		// Passed to --extensionTestsPath
		const extensionTestsPath = path.resolve(__dirname, './suite/index');

		// Use fixture files as the workspace so file-scanning tests have real files
		const workspacePath = path.resolve(__dirname, '../../src/test/fixtures');

		// Download VS Code, unzip it and run the integration test
		await runTests({
			extensionDevelopmentPath,
			extensionTestsPath,
			launchArgs: [workspacePath, '--disable-workspace-trust'],
		});
	} catch (err) {
		console.error('Failed to run tests');
		process.exit(1);
	}
}

main();
