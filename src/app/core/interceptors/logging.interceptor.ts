import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggingService } from '../services/logging.service';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  constructor(private loggingService: LoggingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const startTime = Date.now();
    const correlationId = this.loggingService.getCorrelationId();

    // Add correlation ID to request headers
    const modifiedRequest = request.clone({
      setHeaders: {
        'X-Correlation-ID': correlationId,
      },
    });

    this.loggingService.debug(`HTTP Request: ${request.method} ${request.url}`, {
      correlationId,
      headers: this.sanitizeHeaders(request.headers),
    });

    return next.handle(modifiedRequest).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            const duration = Date.now() - startTime;
            this.loggingService.debug(
              `HTTP Response: ${event.status} ${event.statusText} (${duration}ms)`,
              {
                correlationId,
                url: event.url,
                duration,
              }
            );
          }
        },
        (error: any) => {
          const duration = Date.now() - startTime;
          this.loggingService.error(
            `HTTP Error: ${error.status} ${error.statusText} (${duration}ms)`,
            {
              correlationId,
              url: error.url,
              duration,
              error: error.message,
            }
          );
        }
      )
    );
  }

  private sanitizeHeaders(headers: any): Record<string, string> {
    const sanitized: Record<string, string> = {};
    const sensitiveHeaders = ['authorization', 'x-api-key', 'cookie'];

    headers.keys().forEach((key: string) => {
      if (sensitiveHeaders.includes(key.toLowerCase())) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = headers.get(key);
      }
    });

    return sanitized;
  }
}
