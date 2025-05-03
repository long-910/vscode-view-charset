# Change Log

All notable changes to the "View Charset" extension will be documented in this file.

## [0.1.3] - 2025-05-03

### Added

- Added CSV export functionality to WebView interface
- Added separate columns for path, filename, and encoding in CSV export
- Improved file path handling in CSV export

### Changed

- Updated WebView interface to support CSV export
- Enhanced file information display in WebView

## [0.1.2] - 2025-05-02

### Added

- Added detailed logging functionality
  - Console logging (always enabled)
  - File logging (configurable via `viewCharset.logToFile` setting)
  - Log level control via `viewCharset.debugMode` setting
- Added more detailed debug information for file processing
- Added configuration documentation for logging features

### Changed

- Improved file search and filtering logic
- Enhanced error handling and reporting
- Updated documentation with logging features

### Fixed

- Fixed file extension filtering issues
- Fixed path handling for Windows environments
- Fixed error messages in Japanese

## [0.1.1] - 2025-05-01

### Added

- Added support for Japanese language
- Added support for Chinese (Simplified) language
- Added support for Chinese (Traditional) language
- Added support for Korean language

### Changed

- Updated README with multi-language support information
- Improved error messages and user feedback

### Fixed

- Fixed character encoding detection for empty files
- Fixed file size limit handling

## [0.1.0] - 2025-05-01

### Added

- Initial release of View Charset
- Basic character encoding detection
- TreeView display of character encodings
- WebView display of character encodings
- Configurable file extensions and exclude patterns
- Caching of character encoding detection results
