import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_ORDER: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };

function serializeArg(a: unknown): string {
    if (a instanceof Error) {
        return JSON.stringify({ message: a.message, stack: a.stack });
    }
    if (a !== null && typeof a === 'object') {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(a)) {
            out[k] = v instanceof Error ? { message: v.message, stack: v.stack } : v;
        }
        return JSON.stringify(out);
    }
    return String(a);
}

export class Logger {
    private static instance: Logger | undefined;
    private configChangeDisposable: vscode.Disposable;
    private outputChannel: vscode.OutputChannel;
    private level: LogLevel = 'info';
    private logToFile: boolean = false;
    private logFilePath: string = '';

    private constructor() {
        this.outputChannel = vscode.window.createOutputChannel('View Charset');
        this.configChangeDisposable = vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('viewCharset.debugMode') || e.affectsConfiguration('viewCharset.logToFile')) {
                this.updateConfig();
            }
        });
        this.updateConfig();
    }

    private updateConfig(): void {
        const config = vscode.workspace.getConfiguration('viewCharset');
        const debugMode = config.get<boolean>('debugMode', false);
        const logToFile = config.get<boolean>('logToFile', false);

        this.level = debugMode ? 'debug' : 'info';
        this.logToFile = logToFile;

        if (logToFile && vscode.workspace.workspaceFolders?.[0]) {
            this.logFilePath = path.join(
                vscode.workspace.workspaceFolders[0].uri.fsPath,
                'view-charset.log'
            );
        }

        this.write('info', 'Logger initialized', { debugMode, logToFile });
    }

    private format(level: string, message: string, args: unknown[]): string {
        const timestamp = new Date().toISOString();
        const meta = args.length > 0 ? ' ' + args.map(serializeArg).join(' ') : '';
        return `[${timestamp}] [${level}] ${message}${meta}`;
    }

    private write(level: LogLevel, message: string, ...args: unknown[]): void {
        if (LEVEL_ORDER[level] < LEVEL_ORDER[this.level]) {
            return;
        }
        const line = this.format(level, message, args);
        console.log(line);
        this.outputChannel.appendLine(line);

        if (this.logToFile && this.logFilePath) {
            try {
                fs.appendFileSync(this.logFilePath, line + '\n');
            } catch {
                // ignore file write errors
            }
        }
    }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    public debug(message: string, ...args: unknown[]): void {
        this.write('debug', message, ...args);
    }

    public info(message: string, ...args: unknown[]): void {
        this.write('info', message, ...args);
    }

    public warn(message: string, ...args: unknown[]): void {
        this.write('warn', message, ...args);
    }

    public error(message: string, ...args: unknown[]): void {
        this.write('error', message, ...args);
    }

    public dispose(): void {
        this.configChangeDisposable.dispose();
        this.outputChannel.dispose();
        Logger.instance = undefined;
    }
}
