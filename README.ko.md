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

## 개요

**View Charset**은 Visual Studio Code 확장 프로그램으로, 작업 공간의 파일 문자 인코딩을 트리 뷰와 웹 뷰에서 표시합니다.
이 확장 프로그램을 사용하면 파일의 문자 인코딩을 쉽게 확인하고 인코딩 관련 문제를 식별할 수 있습니다.

## 기능

- **문자 인코딩 표시**
  - 트리 뷰：**작업 공간 디렉터리 구조를 그대로 반영한 폴더 트리 형식**으로 파일과 문자 인코딩을 표시합니다. 폴더는 접기/펼치기가 가능하며, BOM이 있는 경우 `UTF-8 BOM` 등으로 표시됩니다
  - 웹 뷰：파일 경로, 문자 인코딩, 줄 끝 문자를 풍부한 테이블 UI로 표시합니다. 검색/필터 및 정렬 기능을 제공합니다
  - 상태 표시줄：오른쪽 하단에 현재 파일의 문자 인코딩(BOM 여부 포함)을 항상 표시합니다. 클릭하면 웹 뷰가 열립니다
  - 다국어 지원 (영어, 일본어, 중국어, 한국어)

- **고급 기능**
  - BOM 감지：트리 뷰와 웹 뷰에서 `UTF-8 BOM`、`UTF-16LE BOM` 등을 표시
  - 줄 끝 문자 감지：웹 뷰 열에서 `CRLF`、`LF`、`Mixed`、`Unknown`을 표시
  - 컨텍스트 메뉴「**클립보드에 문자 인코딩 복사**」：트리 뷰에서 파일을 우클릭하여 인코딩 문자열을 복사
  - 설정 가능한 파일 확장자와 제외 패턴
  - 문자 인코딩 감지 결과의 캐시
  - 디버깅을 위한 상세 로그
  - 웹 뷰에서의 CSV 내보내기（경로, 파일명, 문자 인코딩, BOM, 줄 끝 문자 열 포함）

## 설치

VS Code 확장 프로그램 뷰(`Ctrl+Shift+X`)에서 **View Charset**을 검색하고 **설치**를 클릭하거나, [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=long-kudo.vscode-view-charset)에서 설치하세요.

## 사용 방법

### 문자 인코딩 보기

1. **트리 뷰에서**:
   - VS Code 탐색기 사이드바에 "View Charset" 뷰가 표시됩니다
   - 작업 공간 디렉터리 구조가 접기/펼치기 가능한 폴더 트리로 표시됩니다
   - 각 파일 옆에 감지된 문자 인코딩（예: `UTF-8`, `UTF-8 BOM`, `SJIS`）이 표시됩니다
   - 폴더를 클릭하면 펼치거나 접을 수 있습니다
   - 파일을 우클릭하여 「**클립보드에 문자 인코딩 복사**」를 선택하면 인코딩 문자열을 복사할 수 있습니다

2. **웹 뷰에서**:
   - 명령 팔레트를 엽니다 (`Ctrl+Shift+P`)
   - "`Open View Charset Web View`"를 실행합니다
   - 검색 상자로 파일 경로나 인코딩 이름으로 필터링
   - 열 헤더를 클릭하여 경로, 인코딩 또는 줄 끝 문자로 정렬
   - "Export to CSV" 버튼을 클릭하여 전체 목록을 내보냅니다（경로, 파일명, 문자 인코딩, BOM, 줄 끝 문자 열 포함）

3. **상태 표시줄에서**:
   - 창 오른쪽 하단에 현재 파일의 문자 인코딩（BOM 여부 포함）이 항상 표시됩니다
   - 상태 표시줄 항목을 클릭하면 웹 뷰가 열립니다

### 설정

VS Code 설정 (`Ctrl+,`)에서 확장 프로그램을 구성:

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

#### 설정 상세

| 설정 항목                     | 설명                        | 기본값                                 |
| ----------------------------- | --------------------------- | -------------------------------------- |
| `viewCharset.fileExtensions`  | 처리할 파일 확장자          | 다양한 텍스트 파일                     |
| `viewCharset.excludePatterns` | 제외할 glob 패턴            | `["**/node_modules/**", "**/.git/**"]` |
| `viewCharset.maxFileSize`     | 최대 파일 크기 (KB)         | `1024`                                 |
| `viewCharset.cacheDuration`   | 캐시 지속 시간 (초)         | `3600`                                 |
| `viewCharset.cacheEnabled`    | 캐시 활성화/비활성화        | `true`                                 |
| `viewCharset.debugMode`       | 디버그 모드 활성화/비활성화 | `false`                                |
| `viewCharset.logToFile`       | 파일 로그 활성화/비활성화   | `false`                                |

### 로그 출력

확장 프로그램은 상세한 로그 출력을 제공:

- **콘솔 로그**: 항상 활성화 (개발자 도구에서 확인 가능)
- **파일 로그**: `viewCharset.logToFile`로 활성화
  - 위치: `{workspaceRoot}/view-charset.log`
  - 로그 레벨: `viewCharset.debugMode`로 제어
    - 디버그: 상세 로그
    - 정보: 기본 로그

## 기여

개발 환경 설정, 프로젝트 구조 및 기여 가이드라인은 [CONTRIBUTING.md](CONTRIBUTING.md)를 참조하세요.

## 라이선스

이 프로젝트는 [MIT 라이선스](LICENSE) 하에 제공됩니다.

## 작성자

- **long-910**
  GitHub: [long-910](https://github.com/long-910)

## 릴리스 노트

자세한 내용은 [CHANGELOG.md](CHANGELOG.md)를 참조하세요.
