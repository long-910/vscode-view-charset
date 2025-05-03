import * as vscode from 'vscode';
import * as path from 'path';
import winston from 'winston';
import { Writable } from 'stream';

export class Logger {
    private static instance: Logger;
    private logger!: winston.Logger;
    private configChangeDisposable: vscode.Disposable;
    private outputChannel: vscode.OutputChannel;

    private constructor() {
        this.outputChannel = vscode.window.createOutputChannel('View Charset');
        this.initializeLogger();
        
        // 設定の変更を監視
        this.configChangeDisposable = vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('viewCharset.debugMode') || e.affectsConfiguration('viewCharset.logToFile')) {
                this.initializeLogger();
            }
        });
    }

    private initializeLogger() {
        const config = vscode.workspace.getConfiguration('viewCharset');
        const transports: winston.transport[] = [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.printf((info) => {
                        const { timestamp, level, message, ...args } = info;
                        return `[${timestamp}] [${level}] ${message} ${Object.keys(args).length ? JSON.stringify(args) : ''}`;
                    })
                )
            }),
            new winston.transports.Stream({
                stream: new Writable({
                    write: (chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void) => {
                        this.outputChannel.append(chunk.toString());
                        callback();
                    }
                }),
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.printf((info) => {
                        const { timestamp, level, message, ...args } = info;
                        return `[${timestamp}] [${level}] ${message} ${Object.keys(args).length ? JSON.stringify(args) : ''}\n`;
                    })
                )
            })
        ];

        if (config.get('logToFile', false)) {
            const logFile = path.join(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '', 'view-charset.log');
            transports.push(new winston.transports.File({ 
                filename: logFile,
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.printf((info) => {
                        const { timestamp, level, message, ...args } = info;
                        return `[${timestamp}] [${level.toUpperCase()}] ${message} ${Object.keys(args).length ? JSON.stringify(args) : ''}\n`;
                    })
                )
            }));
        }

        this.logger = winston.createLogger({
            level: config.get('debugMode', false) ? 'debug' : 'info',
            transports
        });

        // 初期化完了をログ出力
        this.logger.info('Logger initialized', {
            debugMode: config.get('debugMode', false),
            logToFile: config.get('logToFile', false)
        });
    }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    public debug(message: string, ...args: any[]): void {
        this.logger.debug(message, ...args);
    }

    public info(message: string, ...args: any[]): void {
        this.logger.info(message, ...args);
    }

    public warn(message: string, ...args: any[]): void {
        this.logger.warn(message, ...args);
    }

    public error(message: string, ...args: any[]): void {
        this.logger.error(message, ...args);
    }

    public dispose(): void {
        this.configChangeDisposable.dispose();
        this.outputChannel.dispose();
    }
} 
