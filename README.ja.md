# VSCode View Charset Extension

<div align="center">

[![VS Marketplace](https://img.shields.io/visual-studio-marketplace/v/long-kudo.vscode-view-charset?style=flat-square&logo=visualstudiocode&logoColor=white&label=Marketplace)](https://marketplace.visualstudio.com/items?itemName=long-kudo.vscode-view-charset)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/long-kudo.vscode-view-charset?style=flat-square&logo=visualstudiocode&logoColor=white)](https://marketplace.visualstudio.com/items?itemName=long-kudo.vscode-view-charset)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/long-kudo.vscode-view-charset?style=flat-square&logo=visualstudiocode&logoColor=white)](https://marketplace.visualstudio.com/items?itemName=long-kudo.vscode-view-charset)

[![License: MIT](https://img.shields.io/github/license/long-910/vscode-view-charset?style=flat-square)](https://github.com/long-910/vscode-view-charset/blob/main/LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/long-910/vscode-view-charset/ci.yml?branch=main&style=flat-square&logo=githubactions&logoColor=white&label=CI)](https://github.com/long-910/vscode-view-charset/actions/workflows/ci.yml)
[![Release](https://github.com/long-910/vscode-view-charset/actions/workflows/release.yml/badge.svg)](https://github.com/long-910/vscode-view-charset/actions/workflows/release.yml)
[![Sponsor](https://img.shields.io/badge/Sponsor-GitHub-pink?logo=github)](https://github.com/sponsors/long-910)

🌐 [English](README.md) | [日本語](README.ja.md) | [简体中文](README.zh-cn.md) | [繁體中文](README.zh-tw.md) | [한국어](README.ko.md)

</div>

## 概要

**View Charset**は、Visual Studio Code の拡張機能で、ワークスペース内のファイルの文字コードをツリービューおよび Web ビューで表示します。
この拡張機能を使用することで、ファイルの文字コードを簡単に確認し、エンコーディングに関連する問題を特定できます。

## 機能

- **文字コード表示**
  - ツリービュー: ワークスペースの**フォルダ構造をそのまま反映したツリー形式**でファイルと文字コードを表示。フォルダは折りたたみ可能で、BOM ありの場合は `UTF-8 BOM` のようにサフィックス付きで表示
  - Web ビュー: ファイルパス・文字コード・改行コードをテーブル形式のリッチ UI で表示。検索・フィルタ・ソート機能付き
  - ステータスバー: 右下にアクティブファイルの文字コード（BOM 有無含む）を常時表示。クリックで Web ビューを開く
  - 多言語対応 (英語、日本語、中国語、韓国語)

- **高度な機能**
  - BOM 検出: `UTF-8 BOM`、`UTF-16LE BOM` などをツリービュー・Web ビューで表示
  - 改行コード検出: `CRLF`・`LF`・`Mixed`・`Unknown` を Web ビューの列として表示
  - コンテキストメニュー「**クリップボードへ文字コードをコピー**」: ツリービューでファイルを右クリックして文字コード文字列をコピー
  - 設定可能なファイル拡張子と除外パターン
  - 文字コード検出結果のキャッシュ
  - デバッグ用の詳細なログ
  - Web ビューからの CSV エクスポート（パス・ファイル名・文字コード・BOM・改行コードの列を含む）

## インストール

VS Code の拡張機能ビュー（`Ctrl+Shift+X`）で **View Charset** を検索して **インストール** をクリックするか、[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=long-kudo.vscode-view-charset) からインストールしてください。

## 使用方法

### 文字コードの表示

1. **ツリービューで**:
   - VS Code のエクスプローラーサイドバーに「View Charset」ビューが表示されます
   - ワークスペースのフォルダ構造がツリー形式で表示されます
   - 各ファイルには検出された文字コード（例: `UTF-8`、`UTF-8 BOM`、`SJIS`）が説明として表示されます
   - フォルダをクリックすると展開・折りたたみができます
   - ファイルを右クリックして「**クリップボードへ文字コードをコピー**」を選択すると、文字コード文字列をコピーできます

2. **Web ビューで**:
   - コマンドパレットを開く (`Ctrl+Shift+P`)
   - 「`Open View Charset Web View`」を実行
   - 検索ボックスでファイルパスや文字コード名でフィルタリング
   - 列ヘッダーをクリックしてパス・文字コード・改行コードでソート
   - 「Export to CSV」ボタンをクリックして一覧をエクスポート（パス・ファイル名・文字コード・BOM・改行コードの列を含む）

3. **ステータスバーで**:
   - ウィンドウ右下にアクティブファイルの文字コード（BOM 有無含む）が常時表示されます
   - ステータスバーアイテムをクリックすると Web ビューが開きます

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

## 貢献

開発環境のセットアップ、プロジェクト構造、コントリビューションガイドラインについては [CONTRIBUTING.md](CONTRIBUTING.md) をご覧ください。

## ライセンス

このプロジェクトは[MIT ライセンス](LICENSE)の下で提供されています。

## 作者

- **long-910**
  GitHub: [long-910](https://github.com/long-910)

## リリースノート

詳細は[CHANGELOG.md](CHANGELOG.md)を参照してください。
