import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { retryWhen, mergeMap, finalize } from 'rxjs/operators';
import { LoggingService } from './logging.service';
import { AppError, ValidationError, AuthenticationError, ServerError } from '../models/error.model';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000;

  constructor(private loggingService: LoggingService) {}

  /**
   * Handle HTTP errors
   */
  handleHttpError(error: HttpErrorResponse): Observable<never> {
    let appError: AppError;

    if (error.status === 0) {
      appError = new AppError(
        'NETWORK_ERROR',
        'Network error occurred. Please check your connection.',
        0
      );
    } else if (error.status === 400) {
      appError = new ValidationError(
        error.error?.message || 'Invalid request',
        error.error?.details
      );
    } else if (error.status === 401) {
      appError = new AuthenticationError(error.error?.message);
    } else if (error.status === 403) {
      appError = new AppError(
        'AUTHORIZATION_ERROR',
        'Access denied',
        403
      );
    } else if (error.status === 404) {
      appError = new AppError(
        'NOT_FOUND',
        error.error?.message || 'Resource not found',
        404
      );
    } else if (error.status === 409) {
      appError = new AppError(
        'CONFLICT',
        error.error?.message || 'Conflict occurred',
        409
      );
    } else if (error.status >= 500) {
      appError = new ServerError(error.error?.message);
    } else {
      appError = new AppError(
        'UNKNOWN_ERROR',
        error.error?.message || 'An unknown error occurred',
        error.status
      );
    }

    this.loggingService.error(`HTTP Error: ${appError.message}`, {
      code: appError.code,
      status: appError.statusCode,
      details: appError.details,
    });

    return throwError(() => appError);
  }

  /**
   * Handle generic errors
   */
  handleError(error: any): Observable<never> {
    let appError: AppError;

    if (error instanceof AppError) {
      appError = error;
    } else if (error instanceof Error) {
      appError = new ServerError(error.message);
    } else {
      appError = new ServerError('An unknown error occurred');
    }

    this.loggingService.error(`Error: ${appError.message}`, error);
    return throwError(() => appError);
  }

  /**
   * Retry logic with exponential backoff
   */
  retryWithBackoff(maxRetries: number = this.maxRetries, delayMs: number = this.retryDelay) {
    return retryWhen((errors) =>
      errors.pipe(
        mergeMap((error, index) => {
          if (index >= maxRetries) {
            return throwError(() => error);
          }

          const delay = delayMs * Math.pow(2, index);
          this.loggingService.warn(
            `Retrying request (attempt ${index + 1}/${maxRetries}) after ${delay}ms`,
            { error: error.message }
          );

          return timer(delay);
        })
      )
    );
  }

  /**
   * Show error notification (to be implemented with toast service)
   */
  showErrorNotification(message: string): void {
    this.loggingService.error(`User notification: ${message}`);
    // TODO: Implement toast notification
  }

  /**
   * Log error with context
   */
  logError(error: any, context?: Record<string, any>): void {
    this.loggingService.error('Error logged', {
      error: error instanceof Error ? error.message : error,
      context,
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
}
