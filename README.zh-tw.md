# VSCode View Charset Extension

[![VS Marketplace](https://img.shields.io/visual-studio-marketplace/v/long-kudo.vscode-view-charset?style=flat-square&logo=visualstudiocode&logoColor=white&label=Marketplace)](https://marketplace.visualstudio.com/items?itemName=long-kudo.vscode-view-charset)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/long-kudo.vscode-view-charset?style=flat-square&logo=visualstudiocode&logoColor=white)](https://marketplace.visualstudio.com/items?itemName=long-kudo.vscode-view-charset)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/long-kudo.vscode-view-charset?style=flat-square&logo=visualstudiocode&logoColor=white)](https://marketplace.visualstudio.com/items?itemName=long-kudo.vscode-view-charset)
[![License: MIT](https://img.shields.io/github/license/long-910/vscode-view-charset?style=flat-square)](https://github.com/long-910/vscode-view-charset/blob/main/LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/long-910/vscode-view-charset/main.yml?branch=main&style=flat-square&logo=githubactions&logoColor=white&label=CI)](https://github.com/long-910/vscode-view-charset/actions/workflows/main.yml)

<div align="center">

## 🌐 Language Selection / 言語選択 / 语言选择 / 語言選擇 / 언어 선택

| [English](README.md) | [日本語](README.ja.md) | [简体中文](README.zh-cn.md) | [繁體中文](README.zh-tw.md) | [한국어](README.ko.md) |
| -------------------- | ---------------------- | --------------------------- | --------------------------- | ---------------------- |

</div>

## 概述

**View Charset** 是一個 Visual Studio Code 擴充功能，可以在樹狀檢視和網頁檢視中顯示工作區檔案的字元編碼。
使用此擴充功能，您可以輕鬆檢查檔案的字元編碼並識別與編碼相關的問題。

## 功能

- **字元編碼顯示**

  - 樹狀檢視：以**與工作區目錄結構完全一致的資料夾樹狀形式**顯示檔案和字元編碼。資料夾可折疊，有 BOM 時以 `UTF-8 BOM` 等形式顯示
  - 網頁檢視：以豐富的表格 UI 顯示檔案路徑、字元編碼和行尾符，支援搜尋/篩選和排序
  - 狀態列：在右下角持續顯示目前檔案的字元編碼（含 BOM 狀態），點擊可開啟網頁檢視
  - 多語言支援（英語、日語、中文、韓語）

- **進階功能**
  - BOM 偵測：在樹狀檢視和網頁檢視中顯示 `UTF-8 BOM`、`UTF-16LE BOM` 等
  - 行尾符偵測：在網頁檢視欄位中顯示 `CRLF`、`LF`、`Mixed` 或 `Unknown`
  - 內容功能表「**複製字元編碼至剪貼簿**」：在樹狀檢視中右鍵點擊檔案即可複製
  - 可設定的檔案副檔名和排除模式
  - 字元編碼偵測結果的快取
  - 詳細的除錯日誌輸出
  - 網頁檢視中的 CSV 匯出（包含路徑、檔案名稱、字元編碼、BOM 和行尾符欄位）

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

### 查看字元編碼

1. **在樹狀檢視中查看**：

   - VS Code 的檔案總管側邊欄中顯示 "View Charset" 檢視
   - 工作區目錄結構以可折疊的資料夾樹狀形式顯示
   - 每個檔案旁顯示偵測到的字元編碼（如 `UTF-8`、`UTF-8 BOM`、`SJIS`）
   - 點擊資料夾可展開或折疊
   - 右鍵點擊檔案，選擇「**複製字元編碼至剪貼簿**」可複製編碼字串

2. **在網頁檢視中查看**：
   - 開啟命令選擇區（`Ctrl+Shift+P`）
   - 執行 "`Open View Charset Web View`"
   - 使用搜尋框按檔案路徑或編碼名稱篩選
   - 點擊欄位標題按路徑、編碼或行尾符排序
   - 點擊"Export to CSV"按鈕匯出完整清單（包含路徑、檔案名稱、字元編碼、BOM 和行尾符欄位）

3. **在狀態列中**：
   - 視窗右下角持續顯示目前檔案的字元編碼（含 BOM 狀態）
   - 點擊狀態列項目可開啟網頁檢視

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
│   ├── extension.ts          # 進入點。命令註冊、事件監聽、CacheManager
│   ├── charsetDetector.ts    # 字元編碼偵測（encoding-japanese，單例）
│   ├── TreeDataProvider.ts   # 檔案總管樹狀檢視。資料夾層級 + 字元編碼標籤
│   ├── webview.ts            # WebView 面板。表格 UI、搜尋/排序、CSV 匯出
│   ├── logger.ts             # 輕量級自訂日誌記錄器（單例）。控制台 + 輸出頻道
│   └── test/
│       ├── runTest.ts        # 整合測試執行器（@vscode/test-electron）
│       ├── fixtures/         # 用於測試工作區的範例檔案
│       └── suite/
│           └── extension.test.ts  # Mocha 測試套件（45 個測試）
├── i18n/                     # NLS 翻譯檔案（en, ja, zh-cn, zh-tw, ko）
├── images/
│   ├── icon.png              # 擴充功能圖示
│   └── viewcharset-icon.png  # 樹狀檢視圖示
├── package.json              # 擴充功能清單
└── tsconfig.json             # TypeScript 設定
```

### 開發指令碼

| 指令                    | 說明                                   |
| ----------------------- | -------------------------------------- |
| `npm run compile`       | TypeScript 建置 + NLS 生成             |
| `npm run watch`         | TypeScript 監看建置                    |
| `npm run watch:webpack` | Webpack 監看建置                       |
| `npm run lint`          | ESLint 檢查                            |
| `npm test`              | 完整測試執行（compile → lint → mocha） |
| `npm run package`       | 生產建置（webpack + NLS）              |

在 VS Code 中按 **F5** 鍵啟動 Extension Development Host 進行手動測試。

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
