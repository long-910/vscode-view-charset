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

| [🇺🇸 English](README.md) | [🇯🇵 日本語](README.ja.md) | [🇨🇳 简体中文](README.zh-cn.md) | [🇹🇼 繁體中文](README.zh-tw.md) | [🇰🇷 한국어](README.ko.md) |
| ----------------------- | ------------------------- | ------------------------------ | ------------------------------ | ------------------------- |

</div>

## 개요

**View Charset**은 Visual Studio Code 확장 프로그램으로, 작업 공간의 파일 문자 인코딩을 트리 뷰와 웹 뷰에서 표시합니다.  
이 확장 프로그램을 사용하면 파일의 문자 인코딩을 쉽게 확인하고 인코딩 관련 문제를 식별할 수 있습니다.

## 기능

- **문자 인코딩 표시**

  - 트리 뷰: 탐색기에 파일과 문자 인코딩을 목록으로 표시
  - 웹 뷰: 파일 이름과 문자 인코딩을 풍부한 UI로 표시
  - 다국어 지원 (영어, 일본어, 중국어, 한국어)

- **고급 기능**
  - 구성 가능한 파일 확장자와 제외 패턴
  - 문자 인코딩 감지 결과의 캐싱
  - 디버깅을 위한 상세 로그 출력
  - 처리 상태의 진행률 표시

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

### 문자 인코딩 확인

1. **트리 뷰에서 확인**:

   - VS Code 탐색기에 "View Charset" 뷰가 표시
   - 파일과 문자 인코딩이 목록으로 표시

2. **웹 뷰에서 확인**:
   - 명령 팔레트 (`Ctrl+Shift+P`) 열기
   - "`Open View Charset Web View`" 실행

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
│   ├── extension.ts          # 확장 프로그램 진입점
│   ├── TreeDataProvider.ts   # 트리 뷰 데이터 제공자
│   ├── logger.ts             # 로그 관리
├── images/
│   ├── icon.png              # 확장 프로그램 아이콘
│   ├── viewcharset-icon.png  # 트리 뷰 아이콘
├── package.json              # 확장 프로그램 설정
├── tsconfig.json             # TypeScript 설정
```

### 개발 스크립트

- **빌드**: `npm run compile`
- **감시 모드**: `npm run watch`
- **Lint**: `npm run lint`
- **테스트**: `npm test`

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
