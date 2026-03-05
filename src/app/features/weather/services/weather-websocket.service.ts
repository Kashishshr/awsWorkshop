import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebSocketService } from '@core/services/websocket.service';
import { WeatherAlert } from '../models/weather-alert.model';
import { LoggingService } from '@core/services/logging.service';

@Injectable({
  providedIn: 'root',
})
export class WeatherWebSocketService {
  constructor(
    private webSocketService: WebSocketService,
    private loggingService: LoggingService
  ) {}

  /**
   * Subscribe to weather alerts via WebSocket
   */
  subscribeToAlerts(): Observable<void> {
    return new Observable((observer) => {
      this.webSocketService.joinRoom('weather-alerts');
      this.loggingService.info('Subscribed to weather alerts');
      observer.next();
      observer.complete();
    });
  }

  /**
   * Listen for weather alerts
   */
  onAlert(): Observable<WeatherAlert> {
    return this.webSocketService.on<WeatherAlert>('weather_alert');
  }

  /**
   * Listen for weather updates
   */
  onWeatherUpdate(): Observable<any> {
    return this.webSocketService.on<any>('weather_update');
  }

  /**
   * Send alert acknowledgment
   */
  acknowledgeAlert(alertId: string): void {
    this.webSocketService.send('acknowledge_alert', { alertId });
  }

  /**
   * Unsubscribe from weather alerts
   */
  unsubscribeFromAlerts(): void {
    this.webSocketService.leaveRoom('weather-alerts');
    this.loggingService.info('Unsubscribed from weather alerts');
  }
}
