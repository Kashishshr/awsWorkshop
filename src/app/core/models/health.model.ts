export interface DeviceHealth {
  deviceId: string;
  healthScore: number; // 0-100
  status: HealthStatus;
  metrics: HealthMetrics;
  alerts: HealthAlert[];
  history: HealthHistory[];
  lastUpdated: Date;
}

export enum HealthStatus {
  HEALTHY = 'healthy',
  WARNING = 'warning',
  CRITICAL = 'critical',
  UNKNOWN = 'unknown',
}

export interface HealthMetrics {
  uptime: number; // percentage
  errorRate: number; // percentage
  responseTime: number; // milliseconds
  cpuUsage?: number; // percentage
  memoryUsage?: number; // percentage
  temperature?: number; // celsius
  vibration?: number; // Hz
  noiseLevel?: number; // dB
  efficiency?: number; // percentage
}

export interface HealthAlert {
  id: string;
  deviceId: string;
  type: HealthAlertType;
  severity: AlertSeverity;
  message: string;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
}

export enum HealthAlertType {
  HIGH_TEMPERATURE = 'high_temperature',
  LOW_EFFICIENCY = 'low_efficiency',
  HIGH_ERROR_RATE = 'high_error_rate',
  SLOW_RESPONSE = 'slow_response',
  OFFLINE = 'offline',
  MAINTENANCE_DUE = 'maintenance_due',
  ANOMALY_DETECTED = 'anomaly_detected',
  CAPACITY_WARNING = 'capacity_warning',
}

export enum AlertSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info',
}

export interface HealthHistory {
  timestamp: Date;
  healthScore: number;
  status: HealthStatus;
  metrics: HealthMetrics;
}

export interface HealthCheckResult {
  deviceId: string;
  passed: boolean;
  checks: HealthCheck[];
  timestamp: Date;
}

export interface HealthCheck {
  name: string;
  passed: boolean;
  value: number;
  threshold: number;
  message?: string;
}

export interface HealthTrend {
  deviceId: string;
  period: TimePeriod;
  trend: 'improving' | 'stable' | 'degrading';
  changePercentage: number;
  averageScore: number;
  minScore: number;
  maxScore: number;
}

export enum TimePeriod {
  HOUR = '1h',
  DAY = '1d',
  WEEK = '1w',
  MONTH = '1m',
  YEAR = '1y',
}
