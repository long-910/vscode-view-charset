# VSCode View Charset Extension

[![Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/long-kudo.vscode-view-charset)](https://marketplace.visualstudio.com/items?itemName=long-kudo.vscode-view-charset)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/long-kudo.vscode-view-charset)](https://marketplace.visualstudio.com/items?itemName=long-kudo.vscode-view-charset)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/long-kudo.vscode-view-charset)](https://marketplace.visualstudio.com/items?itemName=long-kudo.vscode-view-charset)  
[![License](https://img.shields.io/github/license/long-910/vscode-view-charset)](https://github.com/long-910/vscode-view-charset/blob/main/LICENSE)
[![CI](https://github.com/long-910/vscode-view-charset/actions/workflows/main.yml/badge.svg)](https://github.com/long-910/vscode-view-charset/actions/workflows/main.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/8fc9c1d775da88566126/maintainability)](https://codeclimate.com/github/long-kudo/vscode-view-charset/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/8fc9c1d775da88566126/test_coverage)](https://codeclimate.com/github/long-kudo/vscode-view-charset/test_coverage)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/d8ab25d02fba415d8690c09832c744cc)](https://app.codacy.com/gh/long-kudo/vscode-view-charset?utm_source=github.com&utm_medium=referral&utm_content=long-kudo/vscode-view-charset&utm_campaign=Badge_Grade_Settings)

## 概要

**View Charset**は、Visual Studio Code の拡張機能で、ワークスペース内のファイルの文字コードをツリービューおよび Web ビューで表示します。  
この拡張機能を使用することで、ファイルの文字コードを簡単に確認し、エンコーディングに関連する問題を特定できます。

---

## 主な機能

- **ツリービューでの文字コード表示**  
  エクスプローラー内にカスタムビュー「View Charset」を追加し、ワークスペース内のファイルとその文字コードを一覧表示します。

![view](https://user-images.githubusercontent.com/69529926/109342067-a9012800-78ae-11eb-9ee8-1f7431d376c1.png)

- **Web ビューでの詳細表示**  
  コマンドを実行して、Web ビューでファイル名と文字コードをリッチな UI で確認できます。

---

## インストール

1. このリポジトリをクローンします:

   ```bash
   git clone https://github.com/long-910/vscode-view-charset.git
   ```

2. 必要な依存関係をインストールします:

   ```bash
   npm install
   ```

3. Visual Studio Code で拡張機能をデバッグモードで起動します:

   ```bash
   npm run compile
   ```

4. F5 キーを押して拡張機能を起動します。

---

## 使用方法

1. **ツリービューでの確認**:

   - Visual Studio Code のエクスプローラーに「View Charset」ビューが表示されます。
   - ワークスペース内のファイルとその文字コードが一覧表示されます。

2. **Web ビューでの確認**:
   - コマンドパレット（`Ctrl+Shift+P`）を開き、「`Open View Charset Web View`」を実行します。
   - Web ビューにファイル名と文字コードが表示されます。

---

## 開発者向け情報

### スクリプト

- **ビルド**:

  ```bash
  npm run compile
  ```

- **ウォッチモードでのビルド**:

  ```bash
  npm run watch
  ```

- **Lint チェック**:

  ```bash
  npm run lint
  ```

- **テスト**:
  ```bash
  npm test
  ```

### ディレクトリ構成

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
├── README.md                 # このファイル
```

---

## 貢献

このプロジェクトへの貢献を歓迎します！以下の手順で貢献できます：

1. このリポジトリをフォークします。
2. 新しいブランチを作成します:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. 変更をコミットします:
   ```bash
   git commit -m "Add your feature description"
   ```
4. プルリクエストを作成します。

---

## ライセンス

このプロジェクトは[MIT ライセンス](LICENSE)の下で提供されています。

---

## 作者

- **long-910**  
  GitHub: [long-910](https://github.com/long-910o)
