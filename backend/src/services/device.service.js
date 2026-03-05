/**
 * Device Service
 * Manages power grid devices and their health status
 */

// Mock devices data
const MOCK_DEVICES = [
  {
    id: 'device_001',
    name: 'Substation Alpha',
    type: 'substation',
    latitude: 40.7128,
    longitude: -74.0060,
    status: 'operational',
    health: 95,
    capacity: 500,
    load: 420,
    temperature: 45,
  },
  {
    id: 'device_002',
    name: 'Transformer Beta',
    type: 'transformer',
    latitude: 40.7580,
    longitude: -73.9855,
    status: 'operational',
    health: 88,
    capacity: 300,
    load: 240,
    temperature: 52,
  },
  {
    id: 'device_003',
    name: 'Transmission Line Gamma',
    type: 'transmission_line',
    latitude: 40.7489,
    longitude: -73.9680,
    status: 'warning',
    health: 72,
    capacity: 1000,
    load: 850,
    temperature: 65,
  },
  {
    id: 'device_004',
    name: 'Distribution Center Delta',
    type: 'distribution_center',
    latitude: 40.7614,
    longitude: -73.9776,
    status: 'operational',
    health: 92,
    capacity: 400,
    load: 320,
    temperature: 48,
  },
  {
    id: 'device_005',
    name: 'Substation Epsilon',
    type: 'substation',
    latitude: 40.7505,
    longitude: -73.9934,
    status: 'operational',
    health: 85,
    capacity: 450,
    load: 380,
    temperature: 55,
  },
  {
    id: 'device_006',
    name: 'Transformer Zeta',
    type: 'transformer',
    latitude: 40.7282,
    longitude: -73.7949,
    status: 'critical',
    health: 45,
    capacity: 250,
    load: 200,
    temperature: 78,
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
