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

| [English](README.md) | [日本語](README.ja.md) | [简体中文](README.zh-cn.md) | [繁體中文](README.zh-tw.md) | [한국어](README.ko.md) |
| -------------------- | ---------------------- | --------------------------- | --------------------------- | ---------------------- |

</div>

## 概述

**View Charset** 是一個 Visual Studio Code 擴充功能，可以在樹狀檢視和網頁檢視中顯示工作區檔案的字符編碼。  
使用此擴充功能，您可以輕鬆檢查檔案的字符編碼並識別與編碼相關的問題。

## 功能

- **字符編碼顯示**

  - 樹狀檢視：在檔案總管中列出檔案和字符編碼
  - 網頁檢視：以豐富的 UI 顯示檔案名稱和字符編碼
  - 多語言支援（英語、日語、中文、韓語）

- **進階功能**
  - 可設定的檔案副檔名和排除模式
  - 字符編碼檢測結果的快取
  - 詳細的除錯日誌輸出
  - 處理狀態的進度顯示

## 安裝

1. 複製儲存庫：

   ```bash
   git clone https://github.com/long-910/vscode-view-charset.git
   ```

2. 安裝相依項目：

   ```bash
   npm install
   ```

3. 建置擴充功能：

   ```bash
   npm run compile
   ```

4. 按 F5 鍵在 VS Code 中開始偵錯

## 使用方法

### 查看字符編碼

1. **在樹狀檢視中查看**：

   - VS Code 的檔案總管中顯示 "View Charset" 檢視
   - 列出檔案和字符編碼

2. **在網頁檢視中查看**：
   - 開啟命令選擇區（`Ctrl+Shift+P`）
   - 執行 "`Open View Charset Web View`"

### 設定

透過 VS Code 設定（`Ctrl+,`）設定擴充功能：

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

#### 設定詳情

| 設定項目                      | 說明               | 預設值                                 |
| ----------------------------- | ------------------ | -------------------------------------- |
| `viewCharset.fileExtensions`  | 要處理的檔案副檔名 | 各種文字檔案                           |
| `viewCharset.excludePatterns` | 要排除的 glob 模式 | `["**/node_modules/**", "**/.git/**"]` |
| `viewCharset.maxFileSize`     | 最大檔案大小（KB） | `1024`                                 |
| `viewCharset.cacheDuration`   | 快取持續時間（秒） | `3600`                                 |
| `viewCharset.cacheEnabled`    | 啟用/停用快取      | `true`                                 |
| `viewCharset.debugMode`       | 啟用/停用除錯模式  | `false`                                |
| `viewCharset.logToFile`       | 啟用/停用檔案日誌  | `false`                                |

### 日誌輸出

擴充功能提供詳細的日誌輸出：

- **控制台日誌**：始終啟用（在開發者工具中可見）
- **檔案日誌**：透過 `viewCharset.logToFile` 啟用
  - 位置：`{workspaceRoot}/view-charset.log`
  - 日誌級別：由 `viewCharset.debugMode` 控制
    - 除錯：詳細日誌
    - 資訊：基本日誌

## 開發

### 專案結構

```
vscode-view-charset/
├── src/
│   ├── extension.ts          # 擴充功能入口點
│   ├── TreeDataProvider.ts   # 樹狀檢視資料提供者
│   ├── logger.ts             # 日誌管理
├── images/
│   ├── icon.png              # 擴充功能圖示
│   ├── viewcharset-icon.png  # 樹狀檢視圖示
├── package.json              # 擴充功能設定
├── tsconfig.json             # TypeScript設定
```

### 開發指令碼

- **建置**：`npm run compile`
- **監看模式**：`npm run watch`
- **Lint**：`npm run lint`
- **測試**：`npm test`

## 貢獻

1. 分叉儲存庫
2. 建立功能分支：`git checkout -b feature/your-feature`
3. 提交變更：`git commit -m "Add your feature"`
4. 推送到分支：`git push origin feature/your-feature`
5. 建立拉取請求

## 授權

此專案在 [MIT 授權](LICENSE) 下提供。

## 作者

- **long-910**  
  GitHub: [long-910](https://github.com/long-910)

## 發行說明

詳情請參見[CHANGELOG.md](CHANGELOG.md)。
