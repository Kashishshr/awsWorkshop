export interface WeatherData {
  id: string;
  location: WeatherLocation;
  current: CurrentWeather;
  forecast: WeatherForecast[];
  alerts: WeatherAlert[];
  lastUpdated: Date;
}

export interface WeatherLocation {
  latitude: number;
  longitude: number;
  name: string;
  country: string;
  timezone: string;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  cloudCover: number;
  precipitation: number;
  visibility: number;
  uvIndex: number;
  condition: WeatherCondition;
  timestamp: Date;
}

export interface WeatherForecast {
  date: Date;
  temperature: {
    min: number;
    max: number;
    avg: number;
  };
  humidity: number;
  precipitation: number;
  windSpeed: number;
  condition: WeatherCondition;
}

export enum WeatherCondition {
  CLEAR = 'clear',
  CLOUDY = 'cloudy',
  RAINY = 'rainy',
  STORMY = 'stormy',
  SNOWY = 'snowy',
  FOGGY = 'foggy',
  WINDY = 'windy',
  HAIL = 'hail',
  TORNADO = 'tornado',
  UNKNOWN = 'unknown',
}

export interface WeatherAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
  affectedArea: GeoArea;
  startTime: Date;
  endTime: Date;
  isActive: boolean;
  dismissed: boolean;
}

export enum AlertType {
  SEVERE_THUNDERSTORM = 'severe_thunderstorm',
  TORNADO = 'tornado',
  EXTREME_WIND = 'extreme_wind',
  HEAVY_RAIN = 'heavy_rain',
  HAIL = 'hail',
  LIGHTNING = 'lightning',
  EXTREME_HEAT = 'extreme_heat',
  EXTREME_COLD = 'extreme_cold',
  FLOOD = 'flood',
  OTHER = 'other',
}

export enum AlertSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export interface GeoArea {
  type: 'point' | 'polygon' | 'circle';
  coordinates: number[][] | number[];
  radius?: number;
}

export interface WeatherDeviceImpact {
  deviceId: string;
  weatherAlertId: string;
  impactType: ImpactType;
  riskLevel: RiskLevel;
  affectedMetrics: string[];
  recommendations: string[];
}

export enum ImpactType {
  DIRECT = 'direct',
  INDIRECT = 'indirect',
  POTENTIAL = 'potential',
}

export enum RiskLevel {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  NONE = 'none',
}
