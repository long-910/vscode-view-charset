# Contributing to VSCode View Charset

## Development Setup

1. Clone this repository:

   ```bash
   git clone https://github.com/long-910/vscode-view-charset.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the extension:

   ```bash
   npm run compile
   ```

4. Press **F5** in VS Code to launch the Extension Development Host for manual testing.

## Project Structure

```
vscode-view-charset/
├── src/
│   ├── extension.ts          # Extension entry point; command registration, event listeners, CacheManager
│   ├── charsetDetector.ts    # Character encoding detection (encoding-japanese, singleton)
│   ├── TreeDataProvider.ts   # Explorer Tree View; folder hierarchy + charset labels
│   ├── webview.ts            # WebView panel; table UI, search/sort, CSV export
│   ├── logger.ts             # Lightweight custom logger (singleton); console + output channel
│   └── test/
│       ├── runTest.ts        # Integration test runner (@vscode/test-electron)
│       ├── fixtures/         # Sample files used as test workspace
│       └── suite/
│           └── extension.test.ts  # Mocha test suite (45 tests)
├── i18n/                     # NLS translation files (en, ja, zh-cn, zh-tw, ko)
├── images/
│   ├── icon.png              # Extension icon
│   └── viewcharset-icon.png  # Tree view icon
├── package.json              # Extension manifest
└── tsconfig.json             # TypeScript settings
```

## Development Scripts

| Command                 | Description                            |
| ----------------------- | -------------------------------------- |
| `npm run compile`       | TypeScript build + NLS generation      |
| `npm run watch`         | TypeScript watch build                 |
| `npm run watch:webpack` | Webpack watch build                    |
| `npm run lint`          | ESLint check                           |
| `npm test`              | Full test run (compile → lint → mocha) |
| `npm run package`       | Production build (webpack + NLS)       |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Create a Pull Request
