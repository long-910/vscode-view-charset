# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VSCode拡張機能。ワークスペース内のファイルの文字コードを Tree View と Web View で表示する。
Marketplace publisher: `long-kudo`、拡張機能ID: `long-kudo.vscode-view-charset`

## Commands

```bash
npm run compile        # TypeScriptビルド + NLS生成（開発時）
npm run watch          # TypeScript監視ビルド
npm run watch:webpack  # Webpackの監視ビルド
npm run lint           # ESLintチェック
npm test               # テスト実行（compile + lint → mocha）
npm run package        # 本番ビルド（webpack + NLS）
```

F5 キーで VSCode の Extension Development Host を起動してデバッグ。

## Architecture

```
src/
├── extension.ts         # エントリポイント。コマンド登録・イベント監視・CacheManager
├── charsetDetector.ts   # encoding-japanese を使った文字コード検出（シングルトン）
├── TreeDataProvider.ts  # Explorer の Tree View 実装。shouldProcessFile でサイズ制限チェック
├── webview.ts           # WebView パネル（リッチUI・CSV エクスポート機能）
└── logger.ts            # winston ベースのロガー（シングルトン）。コンソール + ファイル出力
```

### データフロー

1. `CharsetTreeDataProvider` が `vscode.workspace.findFiles` でワークスペースのファイルを収集
2. `CharsetDetector` が encoding-japanese でバイナリを読んで文字コードを判定（結果をキャッシュ）
3. `CacheManager`（extension.ts）がキャッシュの TTL 管理（設定: `viewCharset.cacheDuration`）
4. 設定変更・ファイル保存時に `treeDataProvider.refresh()` と `webview?.refresh()` を両方呼ぶ

### 多言語化 (NLS)

- `i18n/package.nls.default.json` が原文（英語）
- `i18n/package.nls.{ja,zh-cn,zh-tw,ko}.json` が各言語の翻訳
- `npm run nls` で `package.nls.json` を生成（ビルド必須ステップ）
- コード内では `vscode-nls` の `localize()` を使用

### ビルド成果物

- `dist/extension.js` — webpack バンドル（本番）
- `out/` — tsc の出力（テスト用）
- `package.nls.json` — NLS コンパイル結果（git 管理対象）
