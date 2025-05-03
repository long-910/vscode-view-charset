import * as vscode from 'vscode';
import * as path from 'path';
import * as encoding from 'encoding-japanese';
import { Logger } from './logger';
import * as fs from 'fs';

export interface FileInfo {
  path: string;
  encoding: string;
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
      const results: FileInfo[] = [];

      for (const file of files) {
        try {
          const encoding = await this.detectCharset(file.fsPath);
          const relativePath = path.relative(workspaceFolder, file.fsPath);
          results.push({
            path: relativePath,
            encoding: encoding
          });
        } catch (error) {
          this.logger.error('Failed to detect charset', { file: file.fsPath, error });
        }
      }

      return results;
    } catch (error) {
      this.logger.error('Failed to get workspace files', { error });
      throw error;
    }
  }

  public async detectCharset(filePath: string): Promise<string> {
    try {
      const content = await vscode.workspace.fs.readFile(vscode.Uri.file(filePath));
      const detected = encoding.detect(content);
      return detected || 'Unknown';
    } catch (error) {
      this.logger.error('Failed to detect charset', { file: filePath, error });
      return 'Unknown';
    }
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
