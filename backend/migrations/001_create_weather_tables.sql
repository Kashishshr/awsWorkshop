-- Migration: Create Weather Tables
-- Description: Creates tables for weather data, alerts, and subscriptions
-- Created: 2026-03-05

-- Weather Data Table
CREATE TABLE IF NOT EXISTS weather_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  temperature DECIMAL(5, 2) NOT NULL,
  condition VARCHAR(100) NOT NULL,
  humidity DECIMAL(5, 2),
  wind_speed DECIMAL(5, 2),
  pressure DECIMAL(7, 2),
  timestamp TIMESTAMP NOT NULL,
  source VARCHAR(50) DEFAULT 'open-meteo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT weather_data_location_timestamp_unique UNIQUE (location, timestamp)
);

-- Create indexes for weather_data
CREATE INDEX idx_weather_data_location ON weather_data(location);
CREATE INDEX idx_weather_data_timestamp ON weather_data(timestamp DESC);
CREATE INDEX idx_weather_data_location_timestamp ON weather_data(location, timestamp DESC);

-- Weather Alerts Table
CREATE TABLE IF NOT EXISTS weather_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(100) NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('critical', 'high', 'moderate', 'low')),
  description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  affected_devices JSONB DEFAULT '[]',
  acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_by UUID,
  acknowledged_at TIMESTAMP,
  dismissed BOOLEAN DEFAULT FALSE,
  dismissed_by UUID,
  dismissed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for weather_alerts
CREATE INDEX idx_weather_alerts_location ON weather_alerts(location);
CREATE INDEX idx_weather_alerts_severity ON weather_alerts(severity);
CREATE INDEX idx_weather_alerts_start_time ON weather_alerts(start_time DESC);
CREATE INDEX idx_weather_alerts_end_time ON weather_alerts(end_time DESC);
CREATE INDEX idx_weather_alerts_active ON weather_alerts(dismissed, end_time) WHERE dismissed = FALSE AND end_time > CURRENT_TIMESTAMP;

-- Weather Subscriptions Table
CREATE TABLE IF NOT EXISTS weather_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  location VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  alert_types JSONB DEFAULT '["all"]',
  severity JSONB DEFAULT '["critical","high"]',
  notification_method VARCHAR(50) DEFAULT 'websocket' CHECK (notification_method IN ('websocket', 'email', 'sms')),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT weather_subscriptions_user_location_unique UNIQUE (user_id, location)
);

-- Create indexes for weather_subscriptions
CREATE INDEX idx_weather_subscriptions_user_id ON weather_subscriptions(user_id);
CREATE INDEX idx_weather_subscriptions_location ON weather_subscriptions(location);
CREATE INDEX idx_weather_subscriptions_active ON weather_subscriptions(active) WHERE active = TRUE;

-- Alert History Table (for tracking alert acknowledgments and dismissals)
CREATE TABLE IF NOT EXISTS alert_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID NOT NULL REFERENCES weather_alerts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL CHECK (action IN ('acknowledged', 'dismissed', 'created')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for alert_history
CREATE INDEX idx_alert_history_alert_id ON alert_history(alert_id);
CREATE INDEX idx_alert_history_user_id ON alert_history(user_id);
CREATE INDEX idx_alert_history_action ON alert_history(action);
CREATE INDEX idx_alert_history_created_at ON alert_history(created_at DESC);

-- Alert Acknowledgments Table (for tracking user acknowledgments)
CREATE TABLE IF NOT EXISTS alert_acknowledgments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID NOT NULL REFERENCES weather_alerts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  acknowledged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT alert_acknowledgments_alert_user_unique UNIQUE (alert_id, user_id)
);

-- Create indexes for alert_acknowledgments
CREATE INDEX idx_alert_acknowledgments_alert_id ON alert_acknowledgments(alert_id);
CREATE INDEX idx_alert_acknowledgments_user_id ON alert_acknowledgments(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_weather_data_updated_at BEFORE UPDATE ON weather_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weather_alerts_updated_at BEFORE UPDATE ON weather_alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weather_subscriptions_updated_at BEFORE UPDATE ON weather_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
