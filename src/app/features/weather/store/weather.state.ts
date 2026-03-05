import { WeatherData, WeatherAlert } from '../models/weather-alert.model';

export interface WeatherState {
  currentWeather: WeatherData | null;
  alerts: WeatherAlert[];
  forecast: any[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  autoRefresh: boolean;
  refreshInterval: number;
}

export const initialWeatherState: WeatherState = {
  currentWeather: null,
  alerts: [],
  forecast: [],
  loading: false,
  error: null,
  lastUpdated: null,
  autoRefresh: true,
  refreshInterval: 300000, // 5 minutes
};
