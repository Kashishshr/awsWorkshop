import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ErrorHandlingService } from '../services/error-handling.service';
import { LoggingService } from '../services/logging.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private readonly retryableStatusCodes = [408, 429, 500, 502, 503, 504];

  constructor(
    private errorHandlingService: ErrorHandlingService,
    private loggingService: LoggingService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retry({
        count: this.shouldRetry(request) ? 3 : 0,
        delay: (error, retryCount) => {
          const delayMs = Math.pow(2, retryCount) * 1000;
          this.loggingService.warn(
            `Retrying request (attempt ${retryCount + 1}/3) after ${delayMs}ms`,
            { url: request.url }
          );
          return new Promise((resolve) => setTimeout(resolve, delayMs));
        },
      }),
      catchError((error: HttpErrorResponse) => {
        this.loggingService.error(`HTTP Error: ${error.status} ${error.statusText}`, {
          url: request.url,
          method: request.method,
          status: error.status,
        });
        return this.errorHandlingService.handleHttpError(error);
      })
    );
  }

  private shouldRetry(request: HttpRequest<any>): boolean {
    // Only retry GET requests
    if (request.method !== 'GET') {
      return false;
    }

    return true;
  }
}
