import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { CharsetDetector } from '../../charsetDetector';
import { CharsetTreeDataProvider } from '../../TreeDataProvider';
import { ViewCharsetWebview } from '../../webview';
import { Logger } from '../../logger';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const tmpFiles: string[] = [];

function createTmpFile(content: string, encoding: BufferEncoding = 'utf8'): string {
  const tmpPath = path.join(
    os.tmpdir(),
    `vcs-test-${Date.now()}-${Math.random().toString(36).slice(2)}.txt`
  );
  fs.writeFileSync(tmpPath, content, encoding);
  tmpFiles.push(tmpPath);
  return tmpPath;
}

/** Minimal fake ExtensionContext for testing ViewCharsetWebview */
function createFakeContext(): vscode.ExtensionContext {
  return {
    subscriptions: [],
    extensionPath: os.tmpdir(),
    extensionUri: vscode.Uri.file(os.tmpdir()),
    globalState: {
      get: () => undefined,
      update: async () => {},
      keys: () => [],
      setKeysForSync: () => {},
    } as unknown as vscode.Memento & { setKeysForSync(keys: readonly string[]): void },
    workspaceState: {
      get: () => undefined,
      update: async () => {},
      keys: () => [],
    } as unknown as vscode.Memento & { setKeysForSync(keys: readonly string[]): void },
    secrets: {} as vscode.SecretStorage,
    storageUri: undefined,
    globalStorageUri: vscode.Uri.file(os.tmpdir()),
    logUri: vscode.Uri.file(os.tmpdir()),
    extensionMode: vscode.ExtensionMode.Test,
    asAbsolutePath: (p: string) => path.join(os.tmpdir(), p),
    storagePath: undefined,
    globalStoragePath: os.tmpdir(),
    logPath: os.tmpdir(),
    environmentVariableCollection: {} as vscode.GlobalEnvironmentVariableCollection,
    extension: {} as vscode.Extension<unknown>,
    languageModelAccessInformation: {} as vscode.LanguageModelAccessInformation,
  };
}

// ─── Test Suites ──────────────────────────────────────────────────────────────

suite('Extension Test Suite', () => {
  suiteSetup(async () => {
    // Ensure the extension is activated before any tests run
    const ext = vscode.extensions.getExtension('long-kudo.vscode-view-charset');
    if (ext && !ext.isActive) {
      await ext.activate();
    }
  });

  suiteTeardown(() => {
    // Clean up temp files created during tests
    for (const f of tmpFiles) {
      try { fs.unlinkSync(f); } catch { /* ignore */ }
    }
  });

  // ── Basic / Activation ────────────────────────────────────────────────────
  suite('Basic', () => {
    test('VSCode API is available', () => {
      assert.ok(vscode.version, 'vscode.version should be defined');
    });

    test('viewcharset.openWebView command is registered', async () => {
      const commands = await vscode.commands.getCommands(true);
      assert.ok(
        commands.includes('viewcharset.openWebView'),
        'openWebView command should be registered'
      );
    });

    test('viewcharset.openFile command is registered', async () => {
      const commands = await vscode.commands.getCommands(true);
      assert.ok(
        commands.includes('viewcharset.openFile'),
        'openFile command should be registered'
      );
    });

    test('viewcharset.copyCharset command is registered', async () => {
      const commands = await vscode.commands.getCommands(true);
      assert.ok(
        commands.includes('viewcharset.copyCharset'),
        'copyCharset command should be registered'
      );
    });
  });

  // ── CharsetDetector ───────────────────────────────────────────────────────
  suite('CharsetDetector', () => {
    test('getInstance() returns the same singleton', () => {
      const a = CharsetDetector.getInstance();
      const b = CharsetDetector.getInstance();
      assert.strictEqual(a, b, 'getInstance() should return the same instance');
    });

    test('detectCharset() returns a non-empty string for a UTF-8 file', async () => {
      const file = createTmpFile('Hello, World! テスト');
      const result = await CharsetDetector.getInstance().detectCharset(file);
      assert.ok(typeof result === 'string', 'result should be a string');
      assert.ok(result.length > 0, `result should be non-empty, got: "${result}"`);
    });

    test('detectCharset() returns "Unknown" for a non-existent file', async () => {
      const result = await CharsetDetector.getInstance().detectCharset(
        '/non/existent/path/file_vcs_test.txt'
      );
      assert.strictEqual(result, 'Unknown');
    });

    test('detectCharset() handles an ASCII-only file', async () => {
      const file = createTmpFile('Hello World ASCII only content');
      const result = await CharsetDetector.getInstance().detectCharset(file);
      assert.ok(typeof result === 'string' && result.length > 0);
    });

    test('shouldProcessFile() returns true for a small file', () => {
      const file = createTmpFile('small content');
      assert.strictEqual(CharsetDetector.getInstance().shouldProcessFile(file), true);
    });

    test('shouldProcessFile() returns false for a non-existent file', () => {
      assert.strictEqual(
        CharsetDetector.getInstance().shouldProcessFile('/no/such/file_vcs_test.txt'),
        false
      );
    });

    test('detectWorkspaceFiles() returns an array', async () => {
      const result = await CharsetDetector.getInstance().detectWorkspaceFiles();
      assert.ok(Array.isArray(result), 'detectWorkspaceFiles() should return an array');
    });

    test('detectWorkspaceFiles() entries have path and encoding fields', async () => {
      const result = await CharsetDetector.getInstance().detectWorkspaceFiles();
      for (const entry of result) {
        assert.ok(typeof entry.path === 'string', 'entry.path should be a string');
        assert.ok(typeof entry.encoding === 'string', 'entry.encoding should be a string');
        assert.ok(entry.encoding.length > 0, 'entry.encoding should be non-empty');
      }
    });

    test('detectWorkspaceFiles() entries have hasBOM and lineEnding fields', async () => {
      const result = await CharsetDetector.getInstance().detectWorkspaceFiles();
      for (const entry of result) {
        assert.ok(typeof entry.hasBOM === 'boolean', 'entry.hasBOM should be a boolean');
        assert.ok(
          ['CRLF', 'LF', 'Mixed', 'Unknown'].includes(entry.lineEnding),
          `entry.lineEnding should be a valid value, got: "${entry.lineEnding}"`
        );
      }
    });

    test('detectSingleFileInfo() returns correct shape for a UTF-8 file', async () => {
      const file = createTmpFile('Hello, World!\nLine 2\n');
      const result = await CharsetDetector.getInstance().detectSingleFileInfo(file);
      assert.ok(typeof result.encoding === 'string' && result.encoding.length > 0);
      assert.ok(typeof result.hasBOM === 'boolean');
      assert.ok(['CRLF', 'LF', 'Mixed', 'Unknown'].includes(result.lineEnding));
    });

    test('detectSingleFileInfo() detects no BOM for a plain UTF-8 file', async () => {
      const file = createTmpFile('No BOM here\n');
      const result = await CharsetDetector.getInstance().detectSingleFileInfo(file);
      assert.strictEqual(result.hasBOM, false, 'Plain UTF-8 file should have no BOM');
    });

    test('detectSingleFileInfo() detects BOM for a UTF-8 BOM file', async () => {
      const tmpPath = path.join(
        os.tmpdir(),
        `vcs-test-bom-${Date.now()}.txt`
      );
      // Write UTF-8 BOM + content
      const bom = Buffer.from([0xEF, 0xBB, 0xBF]);
      const content = Buffer.from('BOM file content\n', 'utf8');
      fs.writeFileSync(tmpPath, Buffer.concat([bom, content]));
      tmpFiles.push(tmpPath);
      const result = await CharsetDetector.getInstance().detectSingleFileInfo(tmpPath);
      assert.strictEqual(result.hasBOM, true, 'UTF-8 BOM file should have hasBOM=true');
    });

    test('detectSingleFileInfo() detects LF line ending', async () => {
      const file = createTmpFile('line1\nline2\nline3\n');
      const result = await CharsetDetector.getInstance().detectSingleFileInfo(file);
      assert.strictEqual(result.lineEnding, 'LF', 'LF-only file should return LF');
    });

    test('detectSingleFileInfo() detects CRLF line ending', async () => {
      const tmpPath = path.join(
        os.tmpdir(),
        `vcs-test-crlf-${Date.now()}.txt`
      );
      fs.writeFileSync(tmpPath, 'line1\r\nline2\r\nline3\r\n', 'binary');
      tmpFiles.push(tmpPath);
      const result = await CharsetDetector.getInstance().detectSingleFileInfo(tmpPath);
      assert.strictEqual(result.lineEnding, 'CRLF', 'CRLF-only file should return CRLF');
    });

    test('detectSingleFileInfo() detects Mixed line endings', async () => {
      const tmpPath = path.join(
        os.tmpdir(),
        `vcs-test-mixed-${Date.now()}.txt`
      );
      fs.writeFileSync(tmpPath, 'line1\r\nline2\nline3\r\n', 'binary');
      tmpFiles.push(tmpPath);
      const result = await CharsetDetector.getInstance().detectSingleFileInfo(tmpPath);
      assert.strictEqual(result.lineEnding, 'Mixed', 'Mixed line endings should return Mixed');
    });

    test('detectSingleFileInfo() returns Unknown for a non-existent file', async () => {
      const result = await CharsetDetector.getInstance().detectSingleFileInfo(
        '/non/existent/path/file_vcs_test2.txt'
      );
      assert.strictEqual(result.encoding, 'Unknown');
      assert.strictEqual(result.hasBOM, false);
      assert.strictEqual(result.lineEnding, 'Unknown');
    });
  });

  // ── CharsetTreeDataProvider ───────────────────────────────────────────────
  suite('CharsetTreeDataProvider', () => {
    test('instantiates correctly', () => {
      const provider = new CharsetTreeDataProvider();
      assert.ok(provider instanceof CharsetTreeDataProvider);
    });

    test('getTreeItem() returns the element unchanged', () => {
      const provider = new CharsetTreeDataProvider();
      const item = new vscode.TreeItem('test.txt', vscode.TreeItemCollapsibleState.None);
      // The provider stores FileItem subclass elements; passing a TreeItem is valid for the interface
      const result = provider.getTreeItem(item as Parameters<typeof provider.getTreeItem>[0]);
      assert.strictEqual(result, item);
    });

    test('onDidChangeTreeData fires after refresh()', done => {
      const provider = new CharsetTreeDataProvider();
      const disposable = provider.onDidChangeTreeData(() => {
        disposable.dispose();
        done();
      });
      provider.refresh();
    });

    test('getChildren() without element returns an array', async () => {
      const provider = new CharsetTreeDataProvider();
      const children = await provider.getChildren();
      assert.ok(Array.isArray(children), 'getChildren() should return an array');
    });

    test('getChildren() with an element returns empty array (leaf nodes)', async () => {
      const provider = new CharsetTreeDataProvider();
      const dummyItem = new vscode.TreeItem('dummy');
      const children = await provider.getChildren(
        dummyItem as Parameters<typeof provider.getChildren>[0]
      );
      assert.deepStrictEqual(children, []);
    });

    test('shouldProcessFile() delegates correctly to CharsetDetector', () => {
      const provider = new CharsetTreeDataProvider();
      const detector = CharsetDetector.getInstance();
      const file = createTmpFile('delegate test content');
      assert.strictEqual(
        provider.shouldProcessFile(file),
        detector.shouldProcessFile(file)
      );
    });

    test('getWorkspaceFiles() returns an array', async () => {
      const provider = new CharsetTreeDataProvider();
      const wsFolder =
        vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? os.tmpdir();
      const files = await provider.getWorkspaceFiles(wsFolder);
      assert.ok(Array.isArray(files), 'getWorkspaceFiles() should return an array');
    });

    test('getWorkspaceFiles() returns strings (relative paths)', async () => {
      const provider = new CharsetTreeDataProvider();
      const wsFolder =
        vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? os.tmpdir();
      const files = await provider.getWorkspaceFiles(wsFolder);
      for (const f of files) {
        assert.ok(typeof f === 'string', `file entry should be a string, got: ${typeof f}`);
      }
    });

    test('getChildren() returns TreeItem elements (folders or files) when workspace has files', async () => {
      if (!vscode.workspace.workspaceFolders?.length) {
        // Skip if no workspace; tested via getWorkspaceFiles above
        return;
      }
      const provider = new CharsetTreeDataProvider();
      const children = await provider.getChildren();
      // Root children can be FolderItem (Collapsed) or FileItem (None)
      for (const child of children) {
        assert.ok(child instanceof vscode.TreeItem);
        // FileItem has collapsibleState None and carries a charset description
        // FolderItem has collapsibleState Collapsed
        const isFile = child.collapsibleState === vscode.TreeItemCollapsibleState.None;
        const isFolder = child.collapsibleState === vscode.TreeItemCollapsibleState.Collapsed;
        assert.ok(isFile || isFolder, 'child should be either a file or folder item');
        if (isFile) {
          assert.ok(child.description !== undefined, 'file item should have charset description');
        }
      }
    });
  });

  // ── Logger ────────────────────────────────────────────────────────────────
  suite('Logger', () => {
    test('getInstance() returns the same singleton', () => {
      const a = Logger.getInstance();
      const b = Logger.getInstance();
      assert.strictEqual(a, b, 'Logger.getInstance() should return the same instance');
    });

    test('debug() does not throw', () => {
      assert.doesNotThrow(() => {
        Logger.getInstance().debug('test debug message', { context: 'unit-test' });
      });
    });

    test('info() does not throw', () => {
      assert.doesNotThrow(() => {
        Logger.getInstance().info('test info message', { context: 'unit-test' });
      });
    });

    test('warn() does not throw', () => {
      assert.doesNotThrow(() => {
        Logger.getInstance().warn('test warn message', { context: 'unit-test' });
      });
    });

    test('error() does not throw', () => {
      assert.doesNotThrow(() => {
        Logger.getInstance().error('test error message', { context: 'unit-test' });
      });
    });
  });

  // ── ViewCharsetWebview ────────────────────────────────────────────────────
  suite('ViewCharsetWebview', () => {
    test('instantiates correctly with a context', () => {
      const ctx = createFakeContext();
      const webview = new ViewCharsetWebview(ctx);
      assert.ok(webview instanceof ViewCharsetWebview);
    });

    test('refresh() resolves without throwing when panel is not open', async () => {
      const ctx = createFakeContext();
      const webview = new ViewCharsetWebview(ctx);
      await assert.doesNotReject(
        async () => webview.refresh(),
        'refresh() should not throw when no panel exists'
      );
    });

    test('refresh() populates file data (resolved without error)', async () => {
      const ctx = createFakeContext();
      const webview = new ViewCharsetWebview(ctx);
      // Should resolve, even if workspace has no files (returns empty array)
      await webview.refresh();
      // No assertion on count — just verify it doesn't reject
    });
  });

  // ── Extension Configuration ───────────────────────────────────────────────
  suite('Configuration', () => {
    test('viewCharset.fileExtensions is a non-empty array', () => {
      const config = vscode.workspace.getConfiguration('viewCharset');
      const extensions = config.get<string[]>('fileExtensions');
      assert.ok(Array.isArray(extensions), 'fileExtensions should be an array');
      assert.ok(extensions!.length > 0, 'fileExtensions should not be empty');
    });

    test('viewCharset.maxFileSize is a positive number', () => {
      const config = vscode.workspace.getConfiguration('viewCharset');
      const maxFileSize = config.get<number>('maxFileSize');
      assert.ok(typeof maxFileSize === 'number', 'maxFileSize should be a number');
      assert.ok(maxFileSize! > 0, 'maxFileSize should be positive');
    });

    test('viewCharset.cacheEnabled is a boolean', () => {
      const config = vscode.workspace.getConfiguration('viewCharset');
      const cacheEnabled = config.get<boolean>('cacheEnabled');
      assert.ok(typeof cacheEnabled === 'boolean', 'cacheEnabled should be a boolean');
    });

    test('viewCharset.cacheDuration is a positive number', () => {
      const config = vscode.workspace.getConfiguration('viewCharset');
      const cacheDuration = config.get<number>('cacheDuration');
      assert.ok(typeof cacheDuration === 'number', 'cacheDuration should be a number');
      assert.ok(cacheDuration! > 0, 'cacheDuration should be positive');
    });

    test('viewCharset.excludePatterns is an array', () => {
      const config = vscode.workspace.getConfiguration('viewCharset');
      const excludePatterns = config.get<string[]>('excludePatterns');
      assert.ok(Array.isArray(excludePatterns), 'excludePatterns should be an array');
    });

    test('viewCharset.debugMode is a boolean', () => {
      const config = vscode.workspace.getConfiguration('viewCharset');
      const debugMode = config.get<boolean>('debugMode');
      assert.ok(typeof debugMode === 'boolean', 'debugMode should be a boolean');
    });

    test('viewCharset.logToFile is a boolean', () => {
      const config = vscode.workspace.getConfiguration('viewCharset');
      const logToFile = config.get<boolean>('logToFile');
      assert.ok(typeof logToFile === 'boolean', 'logToFile should be a boolean');
    });
  });

  // ── CacheManager (indirect via extension internals) ────────────────────────
  suite('CacheManager (indirect)', () => {
    test('configuration change event fires without error', async () => {
      // Trigger a configuration change and verify the extension does not crash
      // (CacheManager.clear() and treeDataProvider.refresh() are called internally)
      await assert.doesNotReject(async () => {
        await vscode.workspace.getConfiguration('viewCharset').update(
          'debugMode',
          false,
          vscode.ConfigurationTarget.Global
        );
      });
    });
  });
});
