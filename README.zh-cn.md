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

**View Charset** 是一个 Visual Studio Code 扩展，可以在树形视图和网页视图中显示工作区文件的字符编码。  
使用此扩展，您可以轻松检查文件的字符编码并识别与编码相关的问题。

## 功能

- **字符编码显示**

  - 树形视图：在资源管理器中列出文件和字符编码
  - 网页视图：以丰富的 UI 显示文件名和字符编码
  - 多语言支持（英语、日语、中文、韩语）

- **高级功能**
  - 可配置的文件扩展名和排除模式
  - 字符编码检测结果的缓存
  - 详细的调试日志输出
  - 处理状态的进度显示
  - Web 视图中的 CSV 导出功能

## 安装

1. 克隆仓库：

   ```bash
   git clone https://github.com/long-910/vscode-view-charset.git
   ```

2. 安装依赖：

   ```bash
   npm install
   ```

3. 构建扩展：

   ```bash
   npm run compile
   ```

4. 按 F5 键在 VS Code 中开始调试

## 使用方法

### 查看字符编码

1. **在树形视图中查看**：

   - VS Code 的资源管理器中显示 "View Charset" 视图
   - 列出文件和字符编码

2. **在网页视图中查看**：
   - 打开命令面板（`Ctrl+Shift+P`）
   - 执行 "`Open View Charset Web View`"
   - 点击"Export to CSV"按钮导出文件字符编码信息
   - CSV 导出包含路径、文件名和字符编码列

### 配置

通过 VS Code 设置（`Ctrl+,`）配置扩展：

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

#### 设置详情

| 设置项                        | 说明               | 默认值                                 |
| ----------------------------- | ------------------ | -------------------------------------- |
| `viewCharset.fileExtensions`  | 要处理的文件扩展名 | 各种文本文件                           |
| `viewCharset.excludePatterns` | 要排除的 glob 模式 | `["**/node_modules/**", "**/.git/**"]` |
| `viewCharset.maxFileSize`     | 最大文件大小（KB） | `1024`                                 |
| `viewCharset.cacheDuration`   | 缓存持续时间（秒） | `3600`                                 |
| `viewCharset.cacheEnabled`    | 启用/禁用缓存      | `true`                                 |
| `viewCharset.debugMode`       | 启用/禁用调试模式  | `false`                                |
| `viewCharset.logToFile`       | 启用/禁用文件日志  | `false`                                |

### 日志输出

扩展提供详细的日志输出：

- **控制台日志**：始终启用（在开发者工具中可见）
- **文件日志**：通过 `viewCharset.logToFile` 启用
  - 位置：`{workspaceRoot}/view-charset.log`
  - 日志级别：由 `viewCharset.debugMode` 控制
    - 调试：详细日志
    - 信息：基本日志

## 开发

### 项目结构

```
vscode-view-charset/
├── src/
│   ├── extension.ts          # 扩展入口点
│   ├── TreeDataProvider.ts   # 树形视图数据提供者
│   ├── logger.ts             # 日志管理
├── images/
│   ├── icon.png              # 扩展图标
│   ├── viewcharset-icon.png  # 树形视图图标
├── package.json              # 扩展设置
├── tsconfig.json             # TypeScript设置
```

### 开发脚本

- **构建**：`npm run compile`
- **监视模式**：`npm run watch`
- **Lint**：`npm run lint`
- **测试**：`npm test`

## 贡献

1. 分叉仓库
2. 创建功能分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -m "Add your feature"`
4. 推送到分支：`git push origin feature/your-feature`
5. 创建拉取请求

## 许可证

此项目在 [MIT 许可证](LICENSE) 下提供。

## 作者

- **long-910**  
  GitHub: [long-910](https://github.com/long-910)

## 发行说明

详情请参见[CHANGELOG.md](CHANGELOG.md)。
