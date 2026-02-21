import * as vscode from 'vscode';
import * as path from 'path';
import * as encoding from 'encoding-japanese';
import { Logger } from './logger';
import * as fs from 'fs';

export interface FileInfo {
  path: string;
  encoding: string;
  hasBOM: boolean;
  lineEnding: 'CRLF' | 'LF' | 'Mixed' | 'Unknown';
}

export class CharsetDetector {
  private static instance: CharsetDetector;
  private logger: Logger;

  private constructor() {
    this.logger = Logger.getInstance();
  }

  public static getInstance(): CharsetDetector {
    if (!CharsetDetector.instance) {
      CharsetDetector.instance = new CharsetDetector();
    }
    return CharsetDetector.instance;
  }

  private detectBOM(bytes: Uint8Array): boolean {
    if (bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) { return true; } // UTF-8
    if (bytes[0] === 0xFF && bytes[1] === 0xFE) { return true; } // UTF-16 LE
    if (bytes[0] === 0xFE && bytes[1] === 0xFF) { return true; } // UTF-16 BE
    return false;
  }

  private detectLineEnding(bytes: Uint8Array): 'CRLF' | 'LF' | 'Mixed' | 'Unknown' {
    let hasCRLF = false, hasLF = false;
    for (let i = 0; i < bytes.length; i++) {
      if (bytes[i] === 0x0D && bytes[i + 1] === 0x0A) { hasCRLF = true; i++; }
      else if (bytes[i] === 0x0A) { hasLF = true; }
    }
    if (hasCRLF && hasLF) { return 'Mixed'; }
    if (hasCRLF) { return 'CRLF'; }
    if (hasLF) { return 'LF'; }
    return 'Unknown';
  }

  public async detectSingleFileInfo(filePath: string): Promise<Omit<FileInfo, 'path'>> {
    try {
      const content = await vscode.workspace.fs.readFile(vscode.Uri.file(filePath));
      const detected = encoding.detect(content);
      const hasBOM = this.detectBOM(content);
      const lineEnding = this.detectLineEnding(content);
      return {
        encoding: detected || 'Unknown',
        hasBOM,
        lineEnding,
      };
    } catch (error) {
      this.logger.error('Failed to detect file info', { file: filePath, error });
      return { encoding: 'Unknown', hasBOM: false, lineEnding: 'Unknown' };
    }
  }

  public async detectWorkspaceFiles(): Promise<FileInfo[]> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceFolder) {
      return [];
    }

    try {
      const config = vscode.workspace.getConfiguration('viewCharset');
      const fileExtensions = config.get<string[]>('fileExtensions', []);
      const excludePatterns = config.get<string[]>('excludePatterns', ['**/node_modules/**', '**/.git/**']);
      const pattern = `**/*{${fileExtensions.join(',')}}`;

      const files = await vscode.workspace.findFiles(pattern, `{${excludePatterns.join(',')}}`);

      const settled = await Promise.allSettled(
        files.map(async (file) => {
          const info = await this.detectSingleFileInfo(file.fsPath);
          return {
            path: path.relative(workspaceFolder, file.fsPath),
            ...info,
          };
        })
      );

      const results: FileInfo[] = [];
      for (const result of settled) {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          this.logger.error('Failed to detect charset', { error: result.reason });
        }
      }

      return results;
    } catch (error) {
      this.logger.error('Failed to get workspace files', { error });
      throw error;
    }
  }

  public async detectCharset(filePath: string): Promise<string> {
    return (await this.detectSingleFileInfo(filePath)).encoding;
  }

  public shouldProcessFile(filePath: string): boolean {
    const config = vscode.workspace.getConfiguration("viewCharset");
    const maxFileSize = config.get<number>("maxFileSize", 1024) * 1024; // Convert KB to bytes

    try {
      const stats = fs.statSync(filePath);
      return stats.size <= maxFileSize;
    } catch (error) {
      this.logger.error("Error checking file size", { filePath, error });
      return false;
    }
  }
}
