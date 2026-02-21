# Change Log

All notable changes to the "View Charset" extension will be documented in this file.

## [Unreleased] - Development environment

### Changed (toolchain only, no functional changes)

- Migrated from deprecated `vscode-test@1.6.1` to `@vscode/test-electron@^2.4.1`
- Migrated ESLint v8 (legacy `.eslintrc.json`) to ESLint v9 with flat config (`eslint.config.mjs`)
- Replaced `@typescript-eslint/eslint-plugin` + `@typescript-eslint/parser` with unified `typescript-eslint@^8`
- Removed unused `jest`, `coveralls`, `@types/glob` devDependencies
- Updated `@types/node` to `22.x` and `@types/vscode` to `^1.96.0`
- Updated `engines.vscode` to `^1.96.0`
- CI: replaced `npm install` with `npm ci`, added `cache: "npm"`, switched to `xvfb-run -a npm test`, updated Node matrix from `[18.x, 20.x]` to `[20.x, 22.x]`
- Deleted `.travis.yml` (fully migrated to GitHub Actions)
- Added `.editorconfig`, `.nvmrc` (Node 22), `.github/dependabot.yml`

## [0.1.6] - 2026-02-21

### Added

- **BOM detection**: Tree View and WebView now show `BOM` suffix when a file has a Byte Order Mark (e.g. `UTF-8 BOM`)
- **Line ending detection**: WebView now displays a "Line Ending" column (`CRLF` / `LF` / `Mixed` / `Unknown`) for each file
- **Status bar**: Active file's encoding (and BOM status) is shown in the status bar at the bottom-right; clicking opens the WebView
- **Context menu "Copy Charset to Clipboard"**: Right-click a file in the Tree View to copy its charset string to the clipboard
- **`cacheEnabled` setting now respected**: The existing `viewCharset.cacheEnabled` configuration key now actually disables the cache when set to `false` (was previously ignored)
- CSV export now includes `BOM` and `LineEnding` columns

### Changed

- `FileInfo` interface extended with `hasBOM: boolean` and `lineEnding` fields
- Tree View file items use `contextValue = "charsetFile"` (was `"file"`) to enable context-menu targeting

## [0.1.5] - 2026-02-21

### Changed

- Replaced `winston` logger with a lightweight custom implementation using only built-in Node.js `fs` and VS Code API
  - Removed 26 transitive dependencies
  - Fixed trailing space in log messages when no metadata is provided
  - Fixed `Error` objects being serialized as `{}` — `message` and `stack` are now included
  - Fixed `Logger.instance` not being reset after `dispose()`, preventing stale instance reuse on re-activation

### Fixed

- Added `.claude/settings.local.json` to `.gitignore` (per-developer local settings should not be version-controlled)

## [0.1.4] - 2026-02-20

### Added

- Tree View now displays files in a **hierarchical folder structure** that mirrors the workspace directory layout
  - Folders appear as collapsible nodes with folder icons, sorted before files at each level
  - Files within each folder are sorted alphabetically
- Comprehensive integration test suite covering all major modules
  - CharsetDetector: singleton, detectCharset, shouldProcessFile, detectWorkspaceFiles
  - CharsetTreeDataProvider: refresh event, getChildren, getWorkspaceFiles, delegation
  - Logger: singleton, debug/info/warn/error methods
  - ViewCharsetWebview: construction, refresh without panel
  - Configuration: all 7 settings validated for type and default values
  - CacheManager: indirect test via configuration change event
- Test fixtures directory (`src/test/fixtures/`) for integration tests
- Test runner now opens fixtures directory as workspace with trust disabled

### Changed

- Tree View changed from a flat file list to a folder tree structure
- Tree cache is built once per refresh cycle and reset on `refresh()` for performance
- Improved project structure documentation in README files

### Fixed

- Fixed Service Worker `InvalidStateError` in WebView
- Fixed various runtime bugs found during debug session
- Fixed ESLint warnings: missing curly braces and naming convention

## [0.1.3] - 2025-05-03

### Added

- Added CSV export functionality to WebView interface
- Added separate columns for path, filename, and encoding in CSV export
- Improved file path handling in CSV export

### Changed

- Updated WebView interface to support CSV export
- Enhanced file information display in WebView

## [0.1.2] - 2025-05-02

### Added

- Added detailed logging functionality
  - Console logging (always enabled)
  - File logging (configurable via `viewCharset.logToFile` setting)
  - Log level control via `viewCharset.debugMode` setting
- Added more detailed debug information for file processing
- Added configuration documentation for logging features

### Changed

- Improved file search and filtering logic
- Enhanced error handling and reporting
- Updated documentation with logging features

### Fixed

- Fixed file extension filtering issues
- Fixed path handling for Windows environments
- Fixed error messages in Japanese

## [0.1.1] - 2025-05-01

### Added

- Added support for Japanese language
- Added support for Chinese (Simplified) language
- Added support for Chinese (Traditional) language
- Added support for Korean language

### Changed

- Updated README with multi-language support information
- Improved error messages and user feedback

### Fixed

- Fixed character encoding detection for empty files
- Fixed file size limit handling

## [0.1.0] - 2025-05-01

### Added

- Initial release of View Charset
- Basic character encoding detection
- TreeView display of character encodings
- WebView display of character encodings
- Configurable file extensions and exclude patterns
- Caching of character encoding detection results
