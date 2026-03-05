import { createReducer, on } from '@ngrx/store';
import { WeatherState, initialWeatherState } from './weather.state';
import * as WeatherActions from './weather.actions';

export const weatherReducer = createReducer(
  initialWeatherState,

  // Load Weather Data
  on(WeatherActions.loadWeatherData, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(WeatherActions.loadWeatherDataSuccess, (state, { weatherData }) => ({
    ...state,
    currentWeather: weatherData,
    loading: false,
    error: null,
    lastUpdated: new Date(),
  })),

  on(WeatherActions.loadWeatherDataFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Subscribe to Alerts
  on(WeatherActions.subscribeToAlerts, (state) => ({
    ...state,
    loading: true,
  })),

  on(WeatherActions.subscribeToAlertsSuccess, (state) => ({
    ...state,
    loading: false,
  })),

  on(WeatherActions.subscribeToAlertsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Receive Alert
  on(WeatherActions.receiveAlert, (state, { alert }) => ({
    ...state,
    alerts: [alert, ...state.alerts],
  })),

  // Dismiss Alert
  on(WeatherActions.dismissAlert, (state, { alertId }) => ({
    ...state,
    alerts: state.alerts.map((alert) =>
      alert.id === alertId ? { ...alert, dismissed: true } : alert
    ),
  })),

  // Set Auto Refresh
  on(WeatherActions.setAutoRefresh, (state, { enabled }) => ({
    ...state,
    autoRefresh: enabled,
  })),

  // Set Refresh Interval
  on(WeatherActions.setRefreshInterval, (state, { interval }) => ({
    ...state,
    refreshInterval: interval,
  })),

  // Clear Error
  on(WeatherActions.clearError, (state) => ({
    ...state,
    error: null,
  })),

  // Clear All Alerts
  on(WeatherActions.clearAllAlerts, (state) => ({
    ...state,
    alerts: [],
  }))
);
