import { TestBed } from '@angular/core/testing';
import { WeatherAlertService } from './weather-alert.service';
import { CurrentWeather, AlertSeverity } from '../models/weather-alert.model';

describe('WeatherAlertService', () => {
  let service: WeatherAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeatherAlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should detect extreme heat alert', () => {
    const weather: CurrentWeather = {
      temperature: 45,
      condition: 'Hot',
      humidity: 50,
      windSpeed: 10,
      pressure: 1013,
      location: 'Test Location',
      timestamp: new Date().toISOString(),
    };

    const alerts = service.detectAlerts(weather);
    expect(alerts.length).toBeGreaterThan(0);
    expect(alerts.some((a) => a.type === 'EXTREME_HEAT')).toBe(true);
  });

  it('should detect high temperature alert', () => {
    const weather: CurrentWeather = {
      temperature: 37,
      condition: 'Hot',
      humidity: 50,
      windSpeed: 10,
      pressure: 1013,
      location: 'Test Location',
      timestamp: new Date().toISOString(),
    };

    const alerts = service.detectAlerts(weather);
    expect(alerts.some((a) => a.type === 'HIGH_TEMPERATURE')).toBe(true);
  });

  it('should detect extreme cold alert', () => {
    const weather: CurrentWeather = {
      temperature: -25,
      condition: 'Cold',
      humidity: 50,
      windSpeed: 10,
      pressure: 1013,
      location: 'Test Location',
      timestamp: new Date().toISOString(),
    };

    const alerts = service.detectAlerts(weather);
    expect(alerts.some((a) => a.type === 'EXTREME_COLD')).toBe(true);
  });

  it('should detect severe wind alert', () => {
    const weather: CurrentWeather = {
      temperature: 20,
      condition: 'Windy',
      humidity: 50,
      windSpeed: 70,
      pressure: 1013,
      location: 'Test Location',
      timestamp: new Date().toISOString(),
    };

    const alerts = service.detectAlerts(weather);
    expect(alerts.some((a) => a.type === 'SEVERE_WIND')).toBe(true);
  });

  it('should filter alerts by severity', () => {
    const weather: CurrentWeather = {
      temperature: 45,
      condition: 'Hot',
      humidity: 50,
      windSpeed: 10,
      pressure: 1013,
      location: 'Test Location',
      timestamp: new Date().toISOString(),
    };

    const alerts = service.detectAlerts(weather);
    const criticalAlerts = service.filterBySeverity(alerts, AlertSeverity.CRITICAL);

    expect(criticalAlerts.length).toBeGreaterThan(0);
    expect(criticalAlerts.every((a) => a.severity === AlertSeverity.CRITICAL)).toBe(true);
  });

  it('should get critical alerts', () => {
    const weather: CurrentWeather = {
      temperature: 45,
      condition: 'Hot',
      humidity: 50,
      windSpeed: 10,
      pressure: 1013,
      location: 'Test Location',
      timestamp: new Date().toISOString(),
    };

    const alerts = service.detectAlerts(weather);
    const criticalAlerts = service.getCriticalAlerts(alerts);

    expect(criticalAlerts.length).toBeGreaterThan(0);
  });

  it('should acknowledge alert', () => {
    const weather: CurrentWeather = {
      temperature: 45,
      condition: 'Hot',
      humidity: 50,
      windSpeed: 10,
      pressure: 1013,
      location: 'Test Location',
      timestamp: new Date().toISOString(),
    };

    const alerts = service.detectAlerts(weather);
    service.acknowledgeAlert(alerts[0].id);

    service.acknowledgedAlerts$.subscribe((acknowledged) => {
      expect(acknowledged.has(alerts[0].id)).toBe(true);
    });
  });

  it('should dismiss alert', () => {
    const weather: CurrentWeather = {
      temperature: 45,
      condition: 'Hot',
      humidity: 50,
      windSpeed: 10,
      pressure: 1013,
      location: 'Test Location',
      timestamp: new Date().toISOString(),
    };

    const alerts = service.detectAlerts(weather);
    service.dismissAlert(alerts[0].id);

    service.dismissedAlerts$.subscribe((dismissed) => {
      expect(dismissed.has(alerts[0].id)).toBe(true);
    });
  });

  it('should restore dismissed alert', () => {
    const weather: CurrentWeather = {
      temperature: 45,
      condition: 'Hot',
      humidity: 50,
      windSpeed: 10,
      pressure: 1013,
      location: 'Test Location',
      timestamp: new Date().toISOString(),
    };

    const alerts = service.detectAlerts(weather);
    service.dismissAlert(alerts[0].id);
    service.restoreAlert(alerts[0].id);

    service.dismissedAlerts$.subscribe((dismissed) => {
      expect(dismissed.has(alerts[0].id)).toBe(false);
    });
  });

  it('should update alerts', () => {
    const weather: CurrentWeather = {
      temperature: 45,
      condition: 'Hot',
      humidity: 50,
      windSpeed: 10,
      pressure: 1013,
      location: 'Test Location',
      timestamp: new Date().toISOString(),
    };

    const alerts = service.detectAlerts(weather);
    service.updateAlerts(alerts);

    service.alerts$.subscribe((updatedAlerts) => {
      expect(updatedAlerts.length).toBeGreaterThan(0);
    });
  });

  it('should clear all alerts', () => {
    const weather: CurrentWeather = {
      temperature: 45,
      condition: 'Hot',
      humidity: 50,
      windSpeed: 10,
      pressure: 1013,
      location: 'Test Location',
      timestamp: new Date().toISOString(),
    };

    const alerts = service.detectAlerts(weather);
    service.updateAlerts(alerts);
    service.clearAlerts();

    service.alerts$.subscribe((updatedAlerts) => {
      expect(updatedAlerts.length).toBe(0);
    });
  });

  it('should get alert statistics', () => {
    const weather: CurrentWeather = {
      temperature: 45,
      condition: 'Hot',
      humidity: 50,
      windSpeed: 10,
      pressure: 1013,
      location: 'Test Location',
      timestamp: new Date().toISOString(),
    };

    const alerts = service.detectAlerts(weather);
    const stats = service.getAlertStats(alerts);

    expect(stats.total).toBeGreaterThan(0);
    expect(stats.critical).toBeGreaterThanOrEqual(0);
    expect(stats.high).toBeGreaterThanOrEqual(0);
  });
});
