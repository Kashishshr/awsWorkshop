import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WeatherState } from './weather.state';

export const selectWeatherState = createFeatureSelector<WeatherState>('weather');

export const selectCurrentWeather = createSelector(
  selectWeatherState,
  (state: WeatherState) => state.currentWeather
);

export const selectAlerts = createSelector(
  selectWeatherState,
  (state: WeatherState) => state.alerts
);

export const selectActiveAlerts = createSelector(
  selectAlerts,
  (alerts) => alerts.filter((alert) => alert.isActive && !alert.dismissed)
);

export const selectForecast = createSelector(
  selectWeatherState,
  (state: WeatherState) => state.forecast
);

export const selectLoading = createSelector(
  selectWeatherState,
  (state: WeatherState) => state.loading
);

export const selectError = createSelector(
  selectWeatherState,
  (state: WeatherState) => state.error
);

export const selectLastUpdated = createSelector(
  selectWeatherState,
  (state: WeatherState) => state.lastUpdated
);

export const selectAutoRefresh = createSelector(
  selectWeatherState,
  (state: WeatherState) => state.autoRefresh
);

export const selectRefreshInterval = createSelector(
  selectWeatherState,
  (state: WeatherState) => state.refreshInterval
);

export const selectAlertCount = createSelector(
  selectActiveAlerts,
  (alerts) => alerts.length
);

export const selectCriticalAlerts = createSelector(
  selectActiveAlerts,
  (alerts) => alerts.filter((alert) => alert.severity === 'critical')
);
