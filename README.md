# VSCode View Charset Extension

[![VS Marketplace](https://img.shields.io/visual-studio-marketplace/v/long-kudo.vscode-view-charset?style=flat-square&logo=visualstudiocode&logoColor=white&label=Marketplace)](https://marketplace.visualstudio.com/items?itemName=long-kudo.vscode-view-charset)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/long-kudo.vscode-view-charset?style=flat-square&logo=visualstudiocode&logoColor=white)](https://marketplace.visualstudio.com/items?itemName=long-kudo.vscode-view-charset)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/long-kudo.vscode-view-charset?style=flat-square&logo=visualstudiocode&logoColor=white)](https://marketplace.visualstudio.com/items?itemName=long-kudo.vscode-view-charset)
[![License: MIT](https://img.shields.io/github/license/long-910/vscode-view-charset?style=flat-square)](https://github.com/long-910/vscode-view-charset/blob/main/LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/long-910/vscode-view-charset/ci.yml?branch=main&style=flat-square&logo=githubactions&logoColor=white&label=CI)](https://github.com/long-910/vscode-view-charset/actions/workflows/ci.yml)
[![Sponsor](https://img.shields.io/badge/Sponsor-GitHub-pink?logo=github)](https://github.com/sponsors/long-910)

<div align="center">

|🌐 [English](README.md) | [日本語](README.ja.md) | [简体中文](README.zh-cn.md) | [繁體中文](README.zh-tw.md) | [한국어](README.ko.md) |
| -------------------- | ---------------------- | --------------------------- | --------------------------- | ---------------------- |

</div>

## Overview

**View Charset** is a Visual Studio Code extension that displays the character encoding of files in your workspace in both tree view and web view.
With this extension, you can easily check the character encoding of files and identify encoding-related issues.

## Features

- **Character Encoding Display**
  - Tree View: Displays files and their character encodings in a **folder tree** that mirrors your workspace directory structure — folders are collapsible, files show the detected charset (with BOM suffix when present, e.g. `UTF-8 BOM`) as a description
  - Web View: Rich UI table of file paths, encodings, and line endings with search/filter and sort
  - Status Bar: Shows the active file's encoding (and BOM status) at the bottom-right; click to open the Web View
  - Multi-language support (English, Japanese, Chinese, Korean)

- **Advanced Features**
  - BOM detection: displays `UTF-8 BOM`, `UTF-16LE BOM`, etc. in Tree View and Web View
  - Line ending detection: `CRLF`, `LF`, `Mixed`, or `Unknown` shown as a Web View column
  - Context menu "**Copy Charset to Clipboard**": right-click a file in the Tree View to copy its charset string
  - Configurable file extensions and exclude patterns
  - Caching of character encoding detection results
  - Detailed logging for debugging
  - CSV export from Web View (includes Path, Filename, Encoding, BOM, and Line Ending columns)

## Installation

Search for **View Charset** in the VS Code Extensions view (`Ctrl+Shift+X`) and click **Install**, or install from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=long-kudo.vscode-view-charset).

## Usage

### Viewing Character Encodings

1. **In Tree View**:
   - The "View Charset" view appears in the VS Code explorer sidebar
   - Your workspace directory structure is shown as a collapsible folder tree
   - Each file displays its detected character encoding (e.g. `UTF-8`, `UTF-8 BOM`, `SJIS`) as the item description
   - Click a folder to expand or collapse it
   - Right-click a file and select "**Copy Charset to Clipboard**" to copy its charset string

2. **In Web View**:
   - Open the command palette (`Ctrl+Shift+P`)
   - Execute "`Open View Charset Web View`"
   - Use the search box to filter by file path or encoding name
   - Click column headers to sort by path, encoding, or line ending
   - Click the "Export to CSV" button to export the full list (includes Path, Filename, Encoding, BOM, and Line Ending columns)

3. **In the Status Bar**:
   - The active file's encoding (and BOM status) is shown at the bottom-right of the window
   - Click the status bar item to open the Web View

### Configuration

Configure the extension through VS Code settings (`Ctrl+,`):

```json
{
  "viewCharset.fileExtensions": [
    ".txt",
    ".csv",
    ".tsv",
    ".json",
    ".xml",
    ".html",
    ".css",
    ".js",
    ".ts"
  ],
  "viewCharset.excludePatterns": ["**/node_modules/**", "**/.git/**"],
  "viewCharset.maxFileSize": 1024,
  "viewCharset.cacheDuration": 3600,
  "viewCharset.cacheEnabled": true,
  "viewCharset.debugMode": false,
  "viewCharset.logToFile": false
}
```

#### Settings Details

| Setting                       | Description                 | Default                                |
| ----------------------------- | --------------------------- | -------------------------------------- |
| `viewCharset.fileExtensions`  | File extensions to process  | Various text files                     |
| `viewCharset.excludePatterns` | Glob patterns to exclude    | `["**/node_modules/**", "**/.git/**"]` |
| `viewCharset.maxFileSize`     | Maximum file size (KB)      | `1024`                                 |
| `viewCharset.cacheDuration`   | Cache duration (seconds)    | `3600`                                 |
| `viewCharset.cacheEnabled`    | Enable/disable caching      | `true`                                 |
| `viewCharset.debugMode`       | Enable/disable debug mode   | `false`                                |
| `viewCharset.logToFile`       | Enable/disable file logging | `false`                                |

### Logging

The extension provides detailed logging:

- **Console Logging**: Always enabled (visible in Developer Tools)
- **File Logging**: Enabled via `viewCharset.logToFile`
  - Location: `{workspaceRoot}/view-charset.log`
  - Log Level: Controlled by `viewCharset.debugMode`
    - Debug: Detailed logs
    - Info: Basic logs

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, project structure, and contribution guidelines.

## License

This project is licensed under the [MIT License](LICENSE).

## Author

- **long-910**
  GitHub: [long-910](https://github.com/long-910)

## Release Notes

See [CHANGELOG.md](CHANGELOG.md) for details.
