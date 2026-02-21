import * as path from 'path';
import * as os from 'os';

import { runTests } from '@vscode/test-electron';

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
		// Use a separate user-data-dir so the test instance doesn't conflict with a running VS Code
		const userDataDir = path.join(os.tmpdir(), 'vscode-test-user-data');
		await runTests({
			extensionDevelopmentPath,
			extensionTestsPath,
			launchArgs: [workspacePath, '--disable-workspace-trust', `--user-data-dir=${userDataDir}`],
		});
	} catch {
		console.error('Failed to run tests');
		process.exit(1);
	}
}

main();
