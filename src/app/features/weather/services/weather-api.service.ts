import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { WeatherData } from '../models/weather-alert.model';
import { ErrorHandlingService } from '@core/services/error-handling.service';

@Injectable({
  providedIn: 'root',
})
export class WeatherApiService {
  private apiUrl = environment.apiUrl;
  private weatherApiUrl = environment.weatherApiUrl;

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) {}

  /**
   * Get current weather data
   */
  getCurrentWeather(): Observable<WeatherData> {
    return this.http.get<WeatherData>(`${this.apiUrl}/weather/current`).pipe(
      catchError((error) => this.errorHandlingService.handleHttpError(error))
    );
  }

  /**
   * Get weather forecast
   */
  getWeatherForecast(days: number = 7): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/weather/forecast`, {
        params: { days: days.toString() },
      })
      .pipe(
        catchError((error) => this.errorHandlingService.handleHttpError(error))
      );
  }

  /**
   * Get weather alerts
   */
  getWeatherAlerts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/weather/alerts`).pipe(
      catchError((error) => this.errorHandlingService.handleHttpError(error))
    );
  }

  /**
   * Get weather from Open-Meteo API
   */
  getOpenMeteoWeather(latitude: number, longitude: number): Observable<any> {
    const params = {
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: 'temperature,relative_humidity,weather_code,wind_speed',
      forecast_days: '7',
    };

    return this.http
      .get<any>(`${this.weatherApiUrl}/forecast`, { params })
      .pipe(
        catchError((error) => this.errorHandlingService.handleHttpError(error))
      );
  }

  /**
   * Subscribe to weather alerts
   */
  subscribeToAlerts(location: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/weather/subscribe`, { location })
      .pipe(
        catchError((error) => this.errorHandlingService.handleHttpError(error))
      );
  }

  /**
   * Unsubscribe from weather alerts
   */
  unsubscribeFromAlerts(subscriptionId: string): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/weather/subscribe/${subscriptionId}`)
      .pipe(
        catchError((error) => this.errorHandlingService.handleHttpError(error))
      );
  }
}
