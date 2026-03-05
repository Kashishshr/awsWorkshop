export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  location: GeoLocation;
  status: DeviceStatus;
  healthScore: number;
  lastUpdated: Date;
  metadata?: Record<string, any>;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
  region?: string;
}

export enum DeviceType {
  TRANSFORMER = 'transformer',
  SUBSTATION = 'substation',
  TRANSMISSION_LINE = 'transmission_line',
  DISTRIBUTION_LINE = 'distribution_line',
  GENERATOR = 'generator',
  SWITCH = 'switch',
  BREAKER = 'breaker',
}

export enum DeviceStatus {
  OPERATIONAL = 'operational',
  DEGRADED = 'degraded',
  OFFLINE = 'offline',
  MAINTENANCE = 'maintenance',
  UNKNOWN = 'unknown',
}

export interface DeviceControl {
  deviceId: string;
  action: ControlAction;
  parameters?: Record<string, any>;
  timestamp: Date;
}

export enum ControlAction {
  POWER_ON = 'power_on',
  POWER_OFF = 'power_off',
  RESET = 'reset',
  MAINTENANCE_MODE = 'maintenance_mode',
}

export interface DeviceMetrics {
  deviceId: string;
  voltage?: number;
  current?: number;
  frequency?: number;
  temperature?: number;
  humidity?: number;
  timestamp: Date;
}
