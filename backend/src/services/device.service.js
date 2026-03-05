/**
 * Device Service
 * Manages power grid devices and their health status
 */

// Mock devices data - Raven Substation area
const MOCK_DEVICES = [
  {
    id: '1234-7654-7801',
    name: '9876',
    type: 'substation',
    substation: 'Raven',
    latitude: 40.7128,
    longitude: -74.0060,
    status: 'operational',
    health: 95,
    capacity: 500,
    load: 420,
    temperature: 45,
    voltage: 138,
    lastMaintenance: '2026-02-15',
  },
  {
    id: '1234-7654-7802',
    name: '9877',
    type: 'transformer',
    substation: 'Raven',
    latitude: 40.7148,
    longitude: -74.0080,
    status: 'operational',
    health: 88,
    capacity: 300,
    load: 240,
    temperature: 52,
    voltage: 69,
    lastMaintenance: '2026-02-20',
  },
  {
    id: '1234-7654-7803',
    name: '9878',
    type: 'circuit_breaker',
    substation: 'Raven',
    latitude: 40.7108,
    longitude: -74.0040,
    status: 'warning',
    health: 72,
    capacity: 1000,
    load: 850,
    temperature: 65,
    voltage: 138,
    lastMaintenance: '2026-01-10',
  },
  {
    id: '1234-7654-7804',
    name: '9879',
    type: 'distribution_panel',
    substation: 'Raven',
    latitude: 40.7138,
    longitude: -74.0050,
    status: 'operational',
    health: 92,
    capacity: 400,
    load: 320,
    temperature: 48,
    voltage: 34.5,
    lastMaintenance: '2026-02-25',
  },
  {
    id: '1234-7654-7805',
    name: '9880',
    type: 'capacitor_bank',
    substation: 'Raven',
    latitude: 40.7118,
    longitude: -74.0070,
    status: 'operational',
    health: 85,
    capacity: 450,
    load: 380,
    temperature: 55,
    voltage: 138,
    lastMaintenance: '2026-02-18',
  },
  {
    id: '1234-7654-7806',
    name: '9881',
    type: 'relay_protection',
    substation: 'Raven',
    latitude: 40.7098,
    longitude: -74.0030,
    status: 'critical',
    health: 45,
    capacity: 250,
    load: 200,
    temperature: 78,
    voltage: 138,
    lastMaintenance: '2025-12-05',
  },
  {
    id: '1234-7654-7807',
    name: '9882',
    type: 'metering_unit',
    substation: 'Raven',
    latitude: 40.7158,
    longitude: -74.0045,
    status: 'operational',
    health: 98,
    capacity: 100,
    load: 75,
    temperature: 42,
    voltage: 138,
    lastMaintenance: '2026-03-01',
  },
  {
    id: '1234-7654-7808',
    name: '9883',
    type: 'bus_bar',
    substation: 'Raven',
    latitude: 40.7088,
    longitude: -74.0055,
    status: 'operational',
    health: 90,
    capacity: 800,
    load: 650,
    temperature: 50,
    voltage: 138,
    lastMaintenance: '2026-02-10',
  },
];

/**
 * Get all devices
 */
const getAllDevices = async () => {
  return MOCK_DEVICES;
};

/**
 * Get device by ID
 */
const getDeviceById = async (deviceId) => {
  return MOCK_DEVICES.find(d => d.id === deviceId);
};

/**
 * Get devices by status
 */
const getDevicesByStatus = async (status) => {
  return MOCK_DEVICES.filter(d => d.status === status);
};

/**
 * Get devices within bounding box
 */
const getDevicesInBounds = async (minLat, maxLat, minLng, maxLng) => {
  return MOCK_DEVICES.filter(d => 
    d.latitude >= minLat && 
    d.latitude <= maxLat && 
    d.longitude >= minLng && 
    d.longitude <= maxLng
  );
};

/**
 * Update device health
 */
const updateDeviceHealth = async (deviceId, health) => {
  const device = MOCK_DEVICES.find(d => d.id === deviceId);
  if (device) {
    device.health = Math.max(0, Math.min(100, health));
    if (health < 50) {
      device.status = 'critical';
    } else if (health < 75) {
      device.status = 'warning';
    } else {
      device.status = 'operational';
    }
  }
  return device;
};

/**
 * Get device statistics
 */
const getDeviceStats = async () => {
  const total = MOCK_DEVICES.length;
  const operational = MOCK_DEVICES.filter(d => d.status === 'operational').length;
  const warning = MOCK_DEVICES.filter(d => d.status === 'warning').length;
  const critical = MOCK_DEVICES.filter(d => d.status === 'critical').length;
  const avgHealth = Math.round(MOCK_DEVICES.reduce((sum, d) => sum + d.health, 0) / total);
  const totalCapacity = MOCK_DEVICES.reduce((sum, d) => sum + d.capacity, 0);
  const totalLoad = MOCK_DEVICES.reduce((sum, d) => sum + d.load, 0);

  return {
    total,
    operational,
    warning,
    critical,
    avgHealth,
    totalCapacity,
    totalLoad,
    utilizationPercent: Math.round((totalLoad / totalCapacity) * 100),
  };
};

module.exports = {
  getAllDevices,
  getDeviceById,
  getDevicesByStatus,
  getDevicesInBounds,
  updateDeviceHealth,
  getDeviceStats,
};
