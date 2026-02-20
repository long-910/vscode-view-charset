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

## 개요

**View Charset**은 Visual Studio Code 확장 프로그램으로, 작업 공간의 파일 문자 인코딩을 트리 뷰와 웹 뷰에서 표시합니다.
이 확장 프로그램을 사용하면 파일의 문자 인코딩을 쉽게 확인하고 인코딩 관련 문제를 식별할 수 있습니다.

## 기능

- **문자 인코딩 표시**

  - 트리 뷰：**작업 공간 디렉터리 구조를 그대로 반영한 폴더 트리 형식**으로 파일과 문자 인코딩을 표시합니다. 폴더는 접기/펼치기가 가능하며, 파일 옆에는 감지된 문자 인코딩이 표시됩니다
  - 웹 뷰：파일 경로와 문자 인코딩을 풍부한 테이블 UI로 표시합니다. 검색/필터 및 정렬 기능을 제공합니다
  - 다국어 지원 (영어, 일본어, 중국어, 한국어)

- **고급 기능**

  - 설정 가능한 파일 확장자와 제외 패턴
  - 문자 인코딩 감지 결과의 캐시
  - 디버깅을 위한 상세 로그
  - 웹 뷰에서의 CSV 내보내기 기능

## 설치

1. 저장소 복제:

   ```bash
   git clone https://github.com/long-910/vscode-view-charset.git
   ```

2. 의존성 설치:

   ```bash
   npm install
   ```

3. 확장 프로그램 빌드:

   ```bash
   npm run compile
   ```

4. F5 키를 눌러 VS Code에서 디버깅 시작

## 사용 방법

### 문자 인코딩 보기

1. **트리 뷰에서**:

   - VS Code 탐색기 사이드바에 "View Charset" 뷰가 표시됩니다
   - 작업 공간 디렉터리 구조가 접기/펼치기 가능한 폴더 트리로 표시됩니다
   - 각 파일 옆에 감지된 문자 인코딩이 표시됩니다
   - 폴더를 클릭하면 펼치거나 접을 수 있습니다

2. **웹 뷰에서**:
   - 명령 팔레트를 엽니다 (`Ctrl+Shift+P`)
   - "`Open View Charset Web View`"를 실행합니다
   - 검색 상자로 파일 경로나 인코딩 이름으로 필터링
   - 열 헤더를 클릭하여 경로 또는 인코딩으로 정렬
   - "Export to CSV" 버튼을 클릭하여 전체 목록을 내보냅니다（경로, 파일명, 인코딩 열 포함）

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

## 개발

### 프로젝트 구조

```
vscode-view-charset/
├── src/
│   ├── extension.ts          # 진입점. 명령 등록, 이벤트 감지, CacheManager
│   ├── charsetDetector.ts    # 문자 인코딩 감지（encoding-japanese, 싱글톤）
│   ├── TreeDataProvider.ts   # 탐색기 트리 뷰. 폴더 계층 + 인코딩 레이블
│   ├── webview.ts            # WebView 패널. 테이블 UI, 검색/정렬, CSV 내보내기
│   ├── logger.ts             # winston 기반 로거（싱글톤）. 콘솔 + 출력 채널
│   └── test/
│       ├── runTest.ts        # 통합 테스트 실행기（vscode-test）
│       ├── fixtures/         # 테스트 워크스페이스용 샘플 파일
│       └── suite/
│           └── extension.test.ts  # Mocha 테스트 스위트（28개 테스트）
├── i18n/                     # NLS 번역 파일（en, ja, zh-cn, zh-tw, ko）
├── images/
│   ├── icon.png              # 확장 프로그램 아이콘
│   └── viewcharset-icon.png  # 트리 뷰 아이콘
├── package.json              # 확장 프로그램 매니페스트
└── tsconfig.json             # TypeScript 설정
```

### 개발 스크립트

| 명령                    | 설명                                     |
| ----------------------- | ---------------------------------------- |
| `npm run compile`       | TypeScript 빌드 + NLS 생성               |
| `npm run watch`         | TypeScript 감시 빌드                     |
| `npm run watch:webpack` | Webpack 감시 빌드                        |
| `npm run lint`          | ESLint 검사                              |
| `npm test`              | 전체 테스트 실행（compile → lint → mocha） |
| `npm run package`       | 프로덕션 빌드（webpack + NLS）           |

VS Code에서 **F5** 키를 눌러 Extension Development Host를 실행하여 수동 테스트를 진행할 수 있습니다.

## 기여

1. 저장소 포크
2. 기능 브랜치 생성: `git checkout -b feature/your-feature`
3. 변경사항 커밋: `git commit -m "Add your feature"`
4. 브랜치에 푸시: `git push origin feature/your-feature`
5. 풀 리퀘스트 생성

## 라이선스

이 프로젝트는 [MIT 라이선스](LICENSE) 하에 제공됩니다.

## 작성자

- **long-910**
  GitHub: [long-910](https://github.com/long-910)

## 릴리스 노트

자세한 내용은 [CHANGELOG.md](CHANGELOG.md)를 참조하세요.
