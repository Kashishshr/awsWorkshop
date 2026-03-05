import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlingService } from './error-handling.service';
import { LoggingService } from './logging.service';
import { AppError, ValidationError, AuthenticationError } from '../models/error.model';

describe('ErrorHandlingService', () => {
  let service: ErrorHandlingService;
  let loggingService: jasmine.SpyObj<LoggingService>;

  beforeEach(() => {
    const loggingSpy = jasmine.createSpyObj('LoggingService', ['error', 'warn']);

    TestBed.configureTestingModule({
      providers: [
        ErrorHandlingService,
        { provide: LoggingService, useValue: loggingSpy },
      ],
    });

    service = TestBed.inject(ErrorHandlingService);
    loggingService = TestBed.inject(LoggingService) as jasmine.SpyObj<LoggingService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('handleHttpError', () => {
    it('should handle 400 validation error', (done) => {
      const error = new HttpErrorResponse({
        status: 400,
        statusText: 'Bad Request',
        error: { message: 'Invalid input' },
      });

      service.handleHttpError(error).subscribe(
        () => fail('should have failed'),
        (err) => {
          expect(err instanceof ValidationError).toBe(true);
          expect(err.statusCode).toBe(400);
          done();
        }
      );
    });

    it('should handle 401 authentication error', (done) => {
      const error = new HttpErrorResponse({
        status: 401,
        statusText: 'Unauthorized',
      });

      service.handleHttpError(error).subscribe(
        () => fail('should have failed'),
        (err) => {
          expect(err instanceof AuthenticationError).toBe(true);
          expect(err.statusCode).toBe(401);
          done();
        }
      );
    });

    it('should handle 403 authorization error', (done) => {
      const error = new HttpErrorResponse({
        status: 403,
        statusText: 'Forbidden',
      });

      service.handleHttpError(error).subscribe(
        () => fail('should have failed'),
        (err) => {
          expect(err.statusCode).toBe(403);
          done();
        }
      );
    });

    it('should handle 404 not found error', (done) => {
      const error = new HttpErrorResponse({
        status: 404,
        statusText: 'Not Found',
      });

      service.handleHttpError(error).subscribe(
        () => fail('should have failed'),
        (err) => {
          expect(err.statusCode).toBe(404);
          done();
        }
      );
    });

    it('should handle 500 server error', (done) => {
      const error = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
      });

      service.handleHttpError(error).subscribe(
        () => fail('should have failed'),
        (err) => {
          expect(err.statusCode).toBe(500);
          done();
        }
      );
    });

    it('should handle network error (status 0)', (done) => {
      const error = new HttpErrorResponse({
        status: 0,
        statusText: 'Unknown Error',
      });

      service.handleHttpError(error).subscribe(
        () => fail('should have failed'),
        (err) => {
          expect(err.statusCode).toBe(0);
          done();
        }
      );
    });
  });

  describe('handleError', () => {
    it('should handle AppError', (done) => {
      const error = new AppError('TEST_ERROR', 'Test error message', 400);

      service.handleError(error).subscribe(
        () => fail('should have failed'),
        (err) => {
          expect(err).toBe(error);
          done();
        }
      );
    });

    it('should handle generic Error', (done) => {
      const error = new Error('Generic error');

      service.handleError(error).subscribe(
        () => fail('should have failed'),
        (err) => {
          expect(err instanceof AppError).toBe(true);
          done();
        }
      );
    });

    it('should handle unknown error', (done) => {
      service.handleError('Unknown error').subscribe(
        () => fail('should have failed'),
        (err) => {
          expect(err instanceof AppError).toBe(true);
          done();
        }
      );
    });
  });

  describe('logError', () => {
    it('should log error with context', () => {
      const error = new Error('Test error');
      const context = { userId: '123' };

      service.logError(error, context);
      expect(loggingService.error).toHaveBeenCalled();
    });
  });
});
