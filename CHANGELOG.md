# Change Log

All notable changes to the "vscode-view-charset" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.1.1] - 2025-05-01

### Added

- **WebView機能**
  - ファイル名と文字コードをリッチなUIで表示するWebViewを追加
- **多言語対応**
  - 日本語、英語、簡体字中国語のサポートを追加
- **設定オプション**
  - 対象ファイル拡張子のカスタマイズ（`viewCharset.fileExtensions`）
  - 最大ファイルサイズの設定（`viewCharset.maxFileSize`）
  - キャッシュの有効/無効切り替え（`viewCharset.cacheEnabled`）
  - キャッシュの有効期間設定（`viewCharset.cacheDuration`）

### Changed

- **パフォーマンス最適化**
  - キャッシュシステムの実装による文字コード検出結果の再利用
  - 並列ファイル処理による高速な文字コード検出
  - プログレス表示による処理状況の可視化
  - ファイルサイズ制限による不要な処理のスキップ
  - ファイル拡張子フィルタリングによる対象ファイルの最適化

## [0.1.0] - 2025-05-01

### Added

- 初期リリース
  - ツリービューでの文字コード表示機能
  - 基本的なファイル検出機能
