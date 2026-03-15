# VSCode View Charset Extension

![VSCode View Charset social preview](https://repository-images.githubusercontent.com/340693785/2e1d7a23-86de-4c7e-b17e-c49881b10fd2)

<div align="center">

[![VS Marketplace](https://img.shields.io/visual-studio-marketplace/v/long-kudo.vscode-view-charset?style=flat-square&logo=visualstudiocode&logoColor=white&label=Marketplace)](https://marketplace.visualstudio.com/items?itemName=long-kudo.vscode-view-charset)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/long-kudo.vscode-view-charset?style=flat-square&logo=visualstudiocode&logoColor=white)](https://marketplace.visualstudio.com/items?itemName=long-kudo.vscode-view-charset)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/long-kudo.vscode-view-charset?style=flat-square&logo=visualstudiocode&logoColor=white)](https://marketplace.visualstudio.com/items?itemName=long-kudo.vscode-view-charset)

[![License: MIT](https://img.shields.io/github/license/long-910/vscode-view-charset?style=flat-square)](https://github.com/long-910/vscode-view-charset/blob/main/LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/long-910/vscode-view-charset/ci.yml?branch=main&style=flat-square&logo=githubactions&logoColor=white&label=CI)](https://github.com/long-910/vscode-view-charset/actions/workflows/ci.yml)
[![Release](https://github.com/long-910/vscode-view-charset/actions/workflows/release.yml/badge.svg)](https://github.com/long-910/vscode-view-charset/actions/workflows/release.yml)
[![Sponsor](https://img.shields.io/badge/Sponsor-GitHub-pink?logo=github)](https://github.com/sponsors/long-910)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?logo=ko-fi&logoColor=white)](https://ko-fi.com/long910)

🌐 [English](README.md) | [日本語](README.ja.md) | [简体中文](README.zh-cn.md) | [繁體中文](README.zh-tw.md) | [한국어](README.ko.md)

</div>

## 概述

**View Charset** 是一个 Visual Studio Code 扩展，可以在树形视图和网页视图中显示工作区文件的字符编码。
使用此扩展，您可以轻松检查文件的字符编码并识别与编码相关的问题。

## 功能

- **字符编码显示**
  - 树形视图：以**与工作区目录结构完全一致的文件夹树形式**显示文件和字符编码。文件夹可折叠，存在 BOM 时以 `UTF-8 BOM` 等形式显示
  - 网页视图：以丰富的表格 UI 显示文件路径、字符编码和行尾符，支持搜索/过滤和排序
  - 状态栏：在右下角持续显示当前文件的字符编码（含 BOM 状态），点击可打开网页视图
  - 多语言支持（英语、日语、中文、韩语）

- **高级功能**
  - BOM 检测：在树形视图和网页视图中显示 `UTF-8 BOM`、`UTF-16LE BOM` 等
  - 行尾符检测：在网页视图列中显示 `CRLF`、`LF`、`Mixed` 或 `Unknown`
  - 上下文菜单"**复制字符编码到剪贴板**"：在树形视图中右键单击文件即可复制
  - 可配置的文件扩展名和排除模式
  - 字符编码检测结果的缓存
  - 详细的调试日志输出
  - 网页视图中的 CSV 导出（包含路径、文件名、字符编码、BOM 和行尾符列）

## 安装

在 VS Code 扩展视图（`Ctrl+Shift+X`）中搜索 **View Charset** 并点击 **安装**，或从 [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=long-kudo.vscode-view-charset) 安装。

## 使用方法

### 查看字符编码

1. **在树形视图中查看**：
   - VS Code 的资源管理器侧边栏中显示 "View Charset" 视图
   - 工作区目录结构以可折叠的文件夹树形式显示
   - 每个文件旁边显示检测到的字符编码（如 `UTF-8`、`UTF-8 BOM`、`SJIS`）
   - 点击文件夹可展开或折叠
   - 右键单击文件，选择"**复制字符编码到剪贴板**"可复制编码字符串

2. **在网页视图中查看**：
   - 打开命令面板（`Ctrl+Shift+P`）
   - 执行 "`Open View Charset Web View`"
   - 使用搜索框按文件路径或编码名称过滤
   - 点击列标题按路径、编码或行尾符排序
   - 点击"Export to CSV"按钮导出完整列表（包含路径、文件名、字符编码、BOM 和行尾符列）

3. **在状态栏中**：
   - 窗口右下角持续显示当前文件的字符编码（含 BOM 状态）
   - 点击状态栏项目可打开网页视图

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

## 贡献

有关开发环境设置、项目结构和贡献指南，请参见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可证

此项目在 [MIT 许可证](LICENSE) 下提供。

## 作者

- **long-910**
  GitHub: [long-910](https://github.com/long-910)

## 发行说明

详情请参见[CHANGELOG.md](CHANGELOG.md)。
