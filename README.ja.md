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

## 概要

**View Charset**は、Visual Studio Code の拡張機能で、ワークスペース内のファイルの文字コードをツリービューおよび Web ビューで表示します。  
この拡張機能を使用することで、ファイルの文字コードを簡単に確認し、エンコーディングに関連する問題を特定できます。

## 機能

- **文字コード表示**

  - ツリービュー：エクスプローラーにファイルと文字コードを一覧表示
  - Web ビュー：ファイル名と文字コードをリッチな UI で表示
  - 多言語対応（英語、日本語、中国語、韓国語）

- **高度な機能**
  - ファイル拡張子と除外パターンの設定可能
  - 文字コード検出結果のキャッシュ機能
  - デバッグ用の詳細なログ出力
  - 処理状況の進捗表示

## インストール

1. リポジトリをクローン:

   ```bash
   git clone https://github.com/long-910/vscode-view-charset.git
   ```

2. 依存関係をインストール:

   ```bash
   npm install
   ```

3. 拡張機能をビルド:

   ```bash
   npm run compile
   ```

4. F5 キーを押して VS Code でデバッグを開始

## 使用方法

### 文字コードの確認

1. **ツリービューで確認**:

   - VS Code のエクスプローラーに「View Charset」ビューが表示
   - ファイルと文字コードが一覧表示

2. **Web ビューで確認**:
   - コマンドパレット（`Ctrl+Shift+P`）を開く
   - 「`Open View Charset Web View`」を実行

### 設定

VS Code の設定（`Ctrl+,`）で拡張機能を設定:

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

#### 設定の詳細

| 設定項目                      | 説明                       | デフォルト値                           |
| ----------------------------- | -------------------------- | -------------------------------------- |
| `viewCharset.fileExtensions`  | 処理するファイル拡張子     | 各種テキストファイル                   |
| `viewCharset.excludePatterns` | 除外する glob パターン     | `["**/node_modules/**", "**/.git/**"]` |
| `viewCharset.maxFileSize`     | 最大ファイルサイズ（KB）   | `1024`                                 |
| `viewCharset.cacheDuration`   | キャッシュの有効期間（秒） | `3600`                                 |
| `viewCharset.cacheEnabled`    | キャッシュの有効/無効      | `true`                                 |
| `viewCharset.debugMode`       | デバッグモードの有効/無効  | `false`                                |
| `viewCharset.logToFile`       | ファイルログの有効/無効    | `false`                                |

### ログ出力

拡張機能は詳細なログ出力を提供:

- **コンソールログ**: 常に有効（開発者ツールで確認可能）
- **ファイルログ**: `viewCharset.logToFile`で有効化
  - 場所: `{workspaceRoot}/view-charset.log`
  - ログレベル: `viewCharset.debugMode`で制御
    - デバッグ: 詳細なログ
    - 情報: 基本的なログ

## 開発

### プロジェクト構造

```
vscode-view-charset/
├── src/
│   ├── extension.ts          # 拡張機能のエントリポイント
│   ├── TreeDataProvider.ts   # ツリービューのデータプロバイダー
│   ├── logger.ts             # ログ管理
├── images/
│   ├── icon.png              # 拡張機能のアイコン
│   ├── viewcharset-icon.png  # ツリービューのアイコン
├── package.json              # 拡張機能の設定
├── tsconfig.json             # TypeScript設定
```

### 開発用スクリプト

- **ビルド**: `npm run compile`
- **ウォッチモード**: `npm run watch`
- **Lint**: `npm run lint`
- **テスト**: `npm test`

## 貢献

1. リポジトリをフォーク
2. 機能ブランチを作成: `git checkout -b feature/your-feature`
3. 変更をコミット: `git commit -m "Add your feature"`
4. ブランチにプッシュ: `git push origin feature/your-feature`
5. プルリクエストを作成

## ライセンス

このプロジェクトは[MIT ライセンス](LICENSE)の下で提供されています。

## 作者

- **long-910**  
  GitHub: [long-910](https://github.com/long-910)

## リリースノート

詳細は[CHANGELOG.md](CHANGELOG.md)を参照してください。
