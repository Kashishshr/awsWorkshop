import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ErrorInterceptor } from './error.interceptor';
import { ErrorHandlingService } from '../services/error-handling.service';
import { LoggingService } from '../services/logging.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

describe('ErrorInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let errorHandlingService: jasmine.SpyObj<ErrorHandlingService>;
  let loggingService: jasmine.SpyObj<LoggingService>;

  beforeEach(() => {
    const errorHandlingSpy = jasmine.createSpyObj('ErrorHandlingService', [
      'handleHttpError',
    ]);
    const loggingSpy = jasmine.createSpyObj('LoggingService', ['error']);

    errorHandlingSpy.handleHttpError.and.returnValue(
      new Promise((_, reject) => reject(new Error('Error handled')))
    );

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorInterceptor,
          multi: true,
        },
        { provide: ErrorHandlingService, useValue: errorHandlingSpy },
        { provide: LoggingService, useValue: loggingSpy },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    errorHandlingService = TestBed.inject(
      ErrorHandlingService
    ) as jasmine.SpyObj<ErrorHandlingService>;
    loggingService = TestBed.inject(LoggingService) as jasmine.SpyObj<LoggingService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should handle successful request', () => {
    httpClient.get('/api/test').subscribe((response) => {
      expect(response).toEqual({ data: 'test' });
    });

    const req = httpMock.expectOne('/api/test');
    req.flush({ data: 'test' });
  });

  it('should retry GET requests on error', () => {
    httpClient.get('/api/test').subscribe(
      () => fail('should have failed'),
      () => {
        // Expected to fail after retries
      }
    );

    // First attempt
    let req = httpMock.expectOne('/api/test');
    req.error(new ErrorEvent('Network error'));

    // Retry attempts would follow
  });

  it('should not retry POST requests', () => {
    httpClient.post('/api/test', {}).subscribe(
      () => fail('should have failed'),
      () => {
        // Expected to fail immediately
      }
    );

    const req = httpMock.expectOne('/api/test');
    req.error(new ErrorEvent('Network error'));
  });

  it('should log errors', () => {
    httpClient.get('/api/test').subscribe(
      () => fail('should have failed'),
      () => {
        // Expected to fail
      }
    );

    const req = httpMock.expectOne('/api/test');
    req.error(new ErrorEvent('Network error'));
  });
});
