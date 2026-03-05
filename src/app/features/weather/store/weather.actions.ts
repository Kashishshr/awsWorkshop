import { createAction, props } from '@ngrx/store';
import { WeatherData, WeatherAlert } from '../models/weather-alert.model';

// Load Weather Data
export const loadWeatherData = createAction('[Weather] Load Weather Data');

export const loadWeatherDataSuccess = createAction(
  '[Weather] Load Weather Data Success',
  props<{ weatherData: WeatherData }>()
);

export const loadWeatherDataFailure = createAction(
  '[Weather] Load Weather Data Failure',
  props<{ error: string }>()
);

// Subscribe to Alerts
export const subscribeToAlerts = createAction('[Weather] Subscribe to Alerts');

export const subscribeToAlertsSuccess = createAction(
  '[Weather] Subscribe to Alerts Success'
);

export const subscribeToAlertsFailure = createAction(
  '[Weather] Subscribe to Alerts Failure',
  props<{ error: string }>()
);

// Receive Alert
export const receiveAlert = createAction(
  '[Weather] Receive Alert',
  props<{ alert: WeatherAlert }>()
);

// Dismiss Alert
export const dismissAlert = createAction(
  '[Weather] Dismiss Alert',
  props<{ alertId: string }>()
);

// Set Auto Refresh
export const setAutoRefresh = createAction(
  '[Weather] Set Auto Refresh',
  props<{ enabled: boolean }>()
);

// Set Refresh Interval
export const setRefreshInterval = createAction(
  '[Weather] Set Refresh Interval',
  props<{ interval: number }>()
);

// Clear Error
export const clearError = createAction('[Weather] Clear Error');

// Clear All Alerts
export const clearAllAlerts = createAction('[Weather] Clear All Alerts');
