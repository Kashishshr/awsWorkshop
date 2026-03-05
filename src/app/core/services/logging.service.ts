import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { v4 as uuid } from 'uuid';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  data?: any;
  correlationId: string;
  stack?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  private logLevel: LogLevel = (environment.logLevel as LogLevel) || 'info';
  private correlationId: string = uuid();
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private readonly logLevels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }

  info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  error(message: string, error?: any): void {
    const stack = error instanceof Error ? error.stack : undefined;
    this.log('error', message, error, stack);
  }

  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  setCorrelationId(id: string): void {
    this.correlationId = id;
  }

  getCorrelationId(): string {
    return this.correlationId;
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  private log(level: LogLevel, message: string, data?: any, stack?: string): void {
    if (this.logLevels[level] < this.logLevels[this.logLevel]) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      data,
      correlationId: this.correlationId,
      stack,
    };

    this.logs.push(entry);

    // Keep logs size manageable
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output
    this.consoleLog(entry);
  }

  private consoleLog(entry: LogEntry): void {
    const prefix = `[${entry.timestamp.toISOString()}] [${entry.level.toUpperCase()}] [${entry.correlationId}]`;
    const message = `${prefix} ${entry.message}`;

    switch (entry.level) {
      case 'debug':
        console.debug(message, entry.data);
        break;
      case 'info':
        console.info(message, entry.data);
        break;
      case 'warn':
        console.warn(message, entry.data);
        break;
      case 'error':
        console.error(message, entry.data);
        if (entry.stack) {
          console.error(entry.stack);
        }
        break;
    }
  }
}
