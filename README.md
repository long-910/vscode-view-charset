# VSCode View Charset Extension

[![Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/long-kudo.vscode-view-charset)](https://marketplace.visualstudio.com/items?itemName=long-kudo.vscode-view-charset)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/long-kudo.vscode-view-charset)](https://marketplace.visualstudio.com/items?itemName=long-kudo.vscode-view-charset)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/long-kudo.vscode-view-charset)](https://marketplace.visualstudio.com/items?itemName=long-kudo.vscode-view-charset)  
[![License](https://img.shields.io/github/license/long-910/vscode-view-charset)](https://github.com/long-910/vscode-view-charset/blob/main/LICENSE)
[![CI](https://github.com/long-910/vscode-view-charset/actions/workflows/main.yml/badge.svg)](https://github.com/long-910/vscode-view-charset/actions/workflows/main.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/8fc9c1d775da88566126/maintainability)](https://codeclimate.com/github/long-kudo/vscode-view-charset/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/8fc9c1d775da88566126/test_coverage)](https://codeclimate.com/github/long-kudo.vscode-view-charset/test_coverage)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/d8ab25d02fba415d8690c09832c744cc)](https://app.codacy.com/gh/long-kudo/vscode-view-charset?utm_source=github.com&utm_medium=referral&utm_content=long-kudo.vscode-view-charset&utm_campaign=Badge_Grade_Settings)

<div align="center">

## 🌐 Language Selection / 言語選択 / 语言选择 / 語言選擇 / 언어 선택

| [🇺🇸 English](README.md) | [🇯🇵 日本語](README.ja.md) | [🇨🇳 简体中文](README.zh-cn.md) | [🇹🇼 繁體中文](README.zh-tw.md) | [🇰🇷 한국어](README.ko.md) |
| ----------------------- | ------------------------- | ------------------------------ | ------------------------------ | ------------------------- |

</div>

## Overview

**View Charset** is a Visual Studio Code extension that displays the character encoding of files in your workspace in both tree view and web view.  
With this extension, you can easily check the character encoding of files and identify encoding-related issues.

## Features

- **Character Encoding Display**

  - Tree View: Lists files and their character encodings in the explorer
  - Web View: Rich UI display of file names and character encodings
  - Multi-language support (English, Japanese, Chinese, Korean)

- **Advanced Features**
  - Configurable file extensions and exclude patterns
  - Caching of character encoding detection results
  - Detailed logging for debugging
  - Progress display for processing status

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/long-910/vscode-view-charset.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the extension:

   ```bash
   npm run compile
   ```

4. Press F5 to start debugging in VS Code.

## Usage

### Viewing Character Encodings

1. **In Tree View**:

   - The "View Charset" view appears in the VS Code explorer
   - Files and their character encodings are listed

2. **In Web View**:
   - Open the command palette (`Ctrl+Shift+P`)
   - Execute "`Open View Charset Web View`"

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

## Development

### Project Structure

```
vscode-view-charset/
├── src/
│   ├── extension.ts          # Extension entry point
│   ├── TreeDataProvider.ts   # Tree view data provider
│   ├── logger.ts             # Log management
├── images/
│   ├── icon.png              # Extension icon
│   ├── viewcharset-icon.png  # Tree view icon
├── package.json              # Extension settings
├── tsconfig.json             # TypeScript settings
```

### Development Scripts

- **Build**: `npm run compile`
- **Watch Mode**: `npm run watch`
- **Lint**: `npm run lint`
- **Test**: `npm test`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Create a Pull Request

## License

This project is licensed under the [MIT License](LICENSE).

## Author

- **long-910**  
  GitHub: [long-910](https://github.com/long-910)

## Release Notes

See [CHANGELOG.md](CHANGELOG.md) for details.
