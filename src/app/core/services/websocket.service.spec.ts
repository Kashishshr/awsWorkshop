import { TestBed } from '@angular/core/testing';
import { WebSocketService } from './websocket.service';
import { LoggingService } from './logging.service';

describe('WebSocketService', () => {
  let service: WebSocketService;
  let loggingService: jasmine.SpyObj<LoggingService>;

  beforeEach(() => {
    const loggingSpy = jasmine.createSpyObj('LoggingService', [
      'info',
      'warn',
      'error',
      'debug',
    ]);

    TestBed.configureTestingModule({
      providers: [
        WebSocketService,
        { provide: LoggingService, useValue: loggingSpy },
      ],
    });

    service = TestBed.inject(WebSocketService);
    loggingService = TestBed.inject(LoggingService) as jasmine.SpyObj<LoggingService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('connection status', () => {
    it('should initially be disconnected', () => {
      expect(service.isConnected()).toBe(false);
    });

    it('should provide connection status observable', (done) => {
      service.getConnectionStatus().subscribe((status) => {
        expect(typeof status).toBe('boolean');
        done();
      });
    });
  });

  describe('room management', () => {
    it('should join room', () => {
      spyOn(service, 'send');
      service.joinRoom('test-room');
      expect(service.send).toHaveBeenCalledWith('join_room', { room: 'test-room' });
    });

    it('should leave room', () => {
      spyOn(service, 'send');
      service.leaveRoom('test-room');
      expect(service.send).toHaveBeenCalledWith('leave_room', { room: 'test-room' });
    });

    it('should broadcast to room', () => {
      spyOn(service, 'send');
      const data = { message: 'test' };
      service.broadcastToRoom('test-room', 'test-event', data);
      expect(service.send).toHaveBeenCalledWith('broadcast_room', {
        room: 'test-room',
        event: 'test-event',
        data,
      });
    });
  });

  describe('send method', () => {
    it('should warn when not connected', () => {
      service.send('test-event', { data: 'test' });
      expect(loggingService.warn).toHaveBeenCalled();
    });
  });

  describe('on method', () => {
    it('should return observable for event', (done) => {
      service.on('test-event').subscribe(
        () => {
          done();
        },
        () => {
          // Expected to error when not connected
          done();
        }
      );
    });
  });

  describe('disconnect', () => {
    it('should disconnect from server', () => {
      service.disconnect();
      expect(service.isConnected()).toBe(false);
    });
  });
});
