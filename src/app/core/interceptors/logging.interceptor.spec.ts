import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { LoggingInterceptor } from './logging.interceptor';
import { LoggingService } from '../services/logging.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

describe('LoggingInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let loggingService: jasmine.SpyObj<LoggingService>;

  beforeEach(() => {
    const loggingSpy = jasmine.createSpyObj('LoggingService', [
      'debug',
      'getCorrelationId',
    ]);
    loggingSpy.getCorrelationId.and.returnValue('test-correlation-id');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LoggingInterceptor,
          multi: true,
        },
        { provide: LoggingService, useValue: loggingSpy },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    loggingService = TestBed.inject(LoggingService) as jasmine.SpyObj<LoggingService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add correlation ID header', () => {
    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('X-Correlation-ID')).toBe(true);
    expect(req.request.headers.get('X-Correlation-ID')).toBe('test-correlation-id');

    req.flush({});
  });

  it('should log request', () => {
    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(loggingService.debug).toHaveBeenCalled();

    req.flush({});
  });

  it('should log response', () => {
    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    req.flush({ data: 'test' });

    expect(loggingService.debug).toHaveBeenCalledTimes(2); // Request + Response
  });

  it('should sanitize sensitive headers', () => {
    httpClient.get('/api/test', {
      headers: {
        Authorization: 'Bearer token',
        'X-API-Key': 'secret-key',
      },
    }).subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(loggingService.debug).toHaveBeenCalled();

    req.flush({});
  });
});
