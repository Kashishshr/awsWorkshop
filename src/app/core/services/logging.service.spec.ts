import { TestBed } from '@angular/core/testing';
import { LoggingService } from './logging.service';

describe('LoggingService', () => {
  let service: LoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggingService],
    });
    service = TestBed.inject(LoggingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('logging methods', () => {
    it('should log debug message', () => {
      spyOn(console, 'debug');
      service.debug('Test debug message', { data: 'test' });
      expect(console.debug).toHaveBeenCalled();
    });

    it('should log info message', () => {
      spyOn(console, 'info');
      service.info('Test info message', { data: 'test' });
      expect(console.info).toHaveBeenCalled();
    });

    it('should log warn message', () => {
      spyOn(console, 'warn');
      service.warn('Test warn message', { data: 'test' });
      expect(console.warn).toHaveBeenCalled();
    });

    it('should log error message', () => {
      spyOn(console, 'error');
      service.error('Test error message', new Error('Test error'));
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('log level control', () => {
    it('should set log level', () => {
      service.setLogLevel('warn');
      spyOn(console, 'debug');
      service.debug('This should not log');
      expect(console.debug).not.toHaveBeenCalled();
    });

    it('should respect log level hierarchy', () => {
      service.setLogLevel('error');
      spyOn(console, 'warn');
      service.warn('This should not log');
      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  describe('correlation ID', () => {
    it('should set and get correlation ID', () => {
      const testId = 'test-correlation-id';
      service.setCorrelationId(testId);
      expect(service.getCorrelationId()).toBe(testId);
    });
  });

  describe('log storage', () => {
    it('should store logs in memory', () => {
      service.clearLogs();
      service.info('Test message 1');
      service.info('Test message 2');
      const logs = service.getLogs();
      expect(logs.length).toBe(2);
    });

    it('should clear logs', () => {
      service.info('Test message');
      service.clearLogs();
      expect(service.getLogs().length).toBe(0);
    });

    it('should maintain max log size', () => {
      service.clearLogs();
      for (let i = 0; i < 1100; i++) {
        service.info(`Message ${i}`);
      }
      const logs = service.getLogs();
      expect(logs.length).toBeLessThanOrEqual(1000);
    });
  });
});
