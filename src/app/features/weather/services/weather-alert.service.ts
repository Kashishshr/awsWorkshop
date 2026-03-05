import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WeatherAlert, AlertSeverity, CurrentWeather } from '../models/weather-alert.model';

@Injectable({
  providedIn: 'root',
})
export class WeatherAlertService {
  private alertsSubject = new BehaviorSubject<WeatherAlert[]>([]);
  public alerts$ = this.alertsSubject.asObservable();

  private criticalAlertsSubject = new BehaviorSubject<WeatherAlert[]>([]);
  public criticalAlerts$ = this.criticalAlertsSubject.asObservable();

  private acknowledgedAlertsSubject = new BehaviorSubject<Set<string>>(new Set());
  public acknowledgedAlerts$ = this.acknowledgedAlertsSubject.asObservable();

  private dismissedAlertsSubject = new BehaviorSubject<Set<string>>(new Set());
  public dismissedAlerts$ = this.dismissedAlertsSubject.asObservable();

  constructor() {}

  /**
   * Detect alerts based on weather conditions
   */
  detectAlerts(weather: CurrentWeather): WeatherAlert[] {
    const alerts: WeatherAlert[] = [];

    // Temperature-based alerts
    if (weather.temperature > 40) {
      alerts.push(this.createAlert('EXTREME_HEAT', AlertSeverity.CRITICAL, weather));
    } else if (weather.temperature > 35) {
      alerts.push(this.createAlert('HIGH_TEMPERATURE', AlertSeverity.HIGH, weather));
    } else if (weather.temperature < -20) {
      alerts.push(this.createAlert('EXTREME_COLD', AlertSeverity.CRITICAL, weather));
    } else if (weather.temperature < 0) {
      alerts.push(this.createAlert('FROST_WARNING', AlertSeverity.HIGH, weather));
    }

    // Wind-based alerts
    if (weather.windSpeed > 80) {
      alerts.push(this.createAlert('HURRICANE_WARNING', AlertSeverity.CRITICAL, weather));
    } else if (weather.windSpeed > 60) {
      alerts.push(this.createAlert('SEVERE_WIND', AlertSeverity.HIGH, weather));
    } else if (weather.windSpeed > 40) {
      alerts.push(this.createAlert('STRONG_WIND', AlertSeverity.MODERATE, weather));
    }

    // Humidity-based alerts
    if (weather.humidity > 90) {
      alerts.push(this.createAlert('HIGH_HUMIDITY', AlertSeverity.MODERATE, weather));
    }

    // Pressure-based alerts
    if (weather.pressure < 980) {
      alerts.push(this.createAlert('LOW_PRESSURE', AlertSeverity.HIGH, weather));
    } else if (weather.pressure > 1040) {
      alerts.push(this.createAlert('HIGH_PRESSURE', AlertSeverity.LOW, weather));
    }

    return alerts;
  }

  /**
   * Filter alerts by severity
   */
  filterBySeverity(alerts: WeatherAlert[], severity: AlertSeverity): WeatherAlert[] {
    return alerts.filter((alert) => alert.severity === severity);
  }

  /**
   * Filter active alerts (not expired, not dismissed)
   */
  filterActiveAlerts(alerts: WeatherAlert[]): WeatherAlert[] {
    const now = new Date();
    const dismissed = this.dismissedAlertsSubject.value;

    return alerts.filter((alert) => {
      const isExpired = new Date(alert.endTime) < now;
      const isDismissed = dismissed.has(alert.id);
      return !isExpired && !isDismissed;
    });
  }

  /**
   * Get critical alerts
   */
  getCriticalAlerts(alerts: WeatherAlert[]): WeatherAlert[] {
    return this.filterBySeverity(alerts, AlertSeverity.CRITICAL);
  }

  /**
   * Acknowledge an alert
   */
  acknowledgeAlert(alertId: string): void {
    const acknowledged = new Set(this.acknowledgedAlertsSubject.value);
    acknowledged.add(alertId);
    this.acknowledgedAlertsSubject.next(acknowledged);
  }

  /**
   * Dismiss an alert
   */
  dismissAlert(alertId: string): void {
    const dismissed = new Set(this.dismissedAlertsSubject.value);
    dismissed.add(alertId);
    this.dismissedAlertsSubject.next(dismissed);
  }

  /**
   * Restore a dismissed alert
   */
  restoreAlert(alertId: string): void {
    const dismissed = new Set(this.dismissedAlertsSubject.value);
    dismissed.delete(alertId);
    this.dismissedAlertsSubject.next(dismissed);
  }

  /**
   * Update alerts list
   */
  updateAlerts(alerts: WeatherAlert[]): void {
    const activeAlerts = this.filterActiveAlerts(alerts);
    const criticalAlerts = this.getCriticalAlerts(activeAlerts);

    this.alertsSubject.next(activeAlerts);
    this.criticalAlertsSubject.next(criticalAlerts);
  }

  /**
   * Clear all alerts
   */
  clearAlerts(): void {
    this.alertsSubject.next([]);
    this.criticalAlertsSubject.next([]);
  }

  /**
   * Clear acknowledged alerts
   */
  clearAcknowledged(): void {
    this.acknowledgedAlertsSubject.next(new Set());
  }

  /**
   * Clear dismissed alerts
   */
  clearDismissed(): void {
    this.dismissedAlertsSubject.next(new Set());
  }

  /**
   * Get alert statistics
   */
  getAlertStats(alerts: WeatherAlert[]): {
    total: number;
    critical: number;
    high: number;
    moderate: number;
    low: number;
  } {
    return {
      total: alerts.length,
      critical: this.filterBySeverity(alerts, AlertSeverity.CRITICAL).length,
      high: this.filterBySeverity(alerts, AlertSeverity.HIGH).length,
      moderate: this.filterBySeverity(alerts, AlertSeverity.MODERATE).length,
      low: this.filterBySeverity(alerts, AlertSeverity.LOW).length,
    };
  }

  /**
   * Create an alert object
   */
  private createAlert(type: string, severity: AlertSeverity, weather: CurrentWeather): WeatherAlert {
    const now = new Date();
    const endTime = new Date(now.getTime() + 3600000); // 1 hour duration

    return {
      id: `${type}-${Date.now()}`,
      type,
      severity,
      description: this.getAlertDescription(type),
      location: weather.location,
      startTime: now.toISOString(),
      endTime: endTime.toISOString(),
      affectedDevices: [],
    };
  }

  /**
   * Get alert description
   */
  private getAlertDescription(type: string): string {
    const descriptions: { [key: string]: string } = {
      EXTREME_HEAT: 'Extreme heat warning - temperature exceeds 40°C',
      HIGH_TEMPERATURE: 'High temperature warning - temperature exceeds 35°C',
      EXTREME_COLD: 'Extreme cold warning - temperature below -20°C',
      FROST_WARNING: 'Frost warning - temperature below 0°C',
      HURRICANE_WARNING: 'Hurricane warning - wind speed exceeds 80 km/h',
      SEVERE_WIND: 'Severe wind warning - wind speed exceeds 60 km/h',
      STRONG_WIND: 'Strong wind warning - wind speed exceeds 40 km/h',
      HIGH_HUMIDITY: 'High humidity warning - humidity exceeds 90%',
      LOW_PRESSURE: 'Low pressure system detected - pressure below 980 hPa',
      HIGH_PRESSURE: 'High pressure system detected - pressure above 1040 hPa',
    };

    return descriptions[type] || 'Weather alert detected';
  }
}
