import * as vscode from 'vscode';
import * as path from 'path';
import winston from 'winston';

export class Logger {
    private static instance: Logger;
    private logger: winston.Logger;

    private constructor() {
        const config = vscode.workspace.getConfiguration('viewCharset');
        const transports: winston.transport[] = [
            new winston.transports.Console()
        ];

        if (config.get('logToFile', false)) {
            const logFile = path.join(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '', 'view-charset.log');
            transports.push(new winston.transports.File({ filename: logFile }));
        }

        this.logger = winston.createLogger({
            level: config.get('debugMode', false) ? 'debug' : 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf((info) => {
                    const { timestamp, level, message, ...args } = info;
                    return `[${timestamp}] [${level.toUpperCase()}] ${message} ${Object.keys(args).length ? JSON.stringify(args) : ''}`;
                })
            ),
            transports
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
} 
