import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject, timer } from 'rxjs';
import { environment } from '@environments/environment';
import { LoggingService } from './logging.service';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: Socket | null = null;
  private connected$ = new BehaviorSubject<boolean>(false);
  private eventSubjects = new Map<string, Subject<any>>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 1000;

  constructor(private loggingService: LoggingService) {}

  /**
   * Connect to WebSocket server
   */
  connect(url: string = environment.wsUrl): Observable<void> {
    return new Observable((observer) => {
      if (this.socket?.connected) {
        observer.next();
        observer.complete();
        return;
      }

      this.socket = io(url, {
        reconnection: true,
        reconnectionDelay: this.reconnectDelay,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: this.maxReconnectAttempts,
      });

      this.socket.on('connect', () => {
        this.loggingService.info('WebSocket connected');
        this.connected$.next(true);
        this.reconnectAttempts = 0;
        observer.next();
        observer.complete();
      });

      this.socket.on('disconnect', () => {
        this.loggingService.warn('WebSocket disconnected');
        this.connected$.next(false);
      });

      this.socket.on('error', (error) => {
        this.loggingService.error('WebSocket error', error);
        observer.error(error);
      });

      this.socket.on('connect_error', (error) => {
        this.loggingService.warn('WebSocket connection error', error);
        this.reconnectAttempts++;
      });
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected$.next(false);
      this.loggingService.info('WebSocket disconnected');
    }
  }

  /**
   * Send event to server
   */
  send(event: string, data: any): void {
    if (!this.socket?.connected) {
      this.loggingService.warn(`Cannot send event '${event}': WebSocket not connected`);
      return;
    }

    this.socket.emit(event, data);
    this.loggingService.debug(`WebSocket event sent: ${event}`, data);
  }

  /**
   * Listen to event from server
   */
  on<T>(event: string): Observable<T> {
    return new Observable((observer) => {
      if (!this.socket) {
        observer.error(new Error('WebSocket not connected'));
        return;
      }

      this.socket.on(event, (data: T) => {
        this.loggingService.debug(`WebSocket event received: ${event}`, data);
        observer.next(data);
      });

      return () => {
        if (this.socket) {
          this.socket.off(event);
        }
      };
    });
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connected$.value;
  }

  /**
   * Get connection status observable
   */
  getConnectionStatus(): Observable<boolean> {
    return this.connected$.asObservable();
  }

  /**
   * Emit event with acknowledgment
   */
  emitWithAck<T>(event: string, data: any): Observable<T> {
    return new Observable((observer) => {
      if (!this.socket?.connected) {
        observer.error(new Error('WebSocket not connected'));
        return;
      }

      this.socket.emit(event, data, (response: T) => {
        observer.next(response);
        observer.complete();
      });
    });
  }

  /**
   * Join a room
   */
  joinRoom(room: string): void {
    this.send('join_room', { room });
    this.loggingService.info(`Joined room: ${room}`);
  }

  /**
   * Leave a room
   */
  leaveRoom(room: string): void {
    this.send('leave_room', { room });
    this.loggingService.info(`Left room: ${room}`);
  }

  /**
   * Broadcast to room
   */
  broadcastToRoom(room: string, event: string, data: any): void {
    this.send('broadcast_room', { room, event, data });
  }
}
