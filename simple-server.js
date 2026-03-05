const http = require('http');
const PORT = 4200;

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Power Grid - Raven Substation</title>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Arial,sans-serif;background:#1a1a2e;color:#eee}
.header{background:rgba(0,0,0,0.5);color:#fff;padding:30px;text-align:center;border-bottom:2px solid #0f3460}
.main{padding:20px;max-width:1400px;margin:0 auto}
.card{background:#16213e;border-radius:8px;padding:20px;margin:20px 0;box-shadow:0 4px 6px rgba(0,0,0,0.3);border:1px solid #0f3460}
h1{font-size:2em;margin-bottom:10px;color:#00d9ff}
h2{color:#00d9ff;border-bottom:2px solid #0f3460;padding-bottom:10px;margin-bottom:15px}
.device-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:15px;margin-top:15px}
.device-card{background:#1a1a2e;border-radius:4px;padding:15px;border-left:4px solid #4caf50;transition:all 0.3s;border:1px solid #0f3460}
.device-card:hover{box-shadow:0 4px 12px rgba(0,217,255,0.3);transform:translateY(-2px)}
.device-card.warning{border-left-color:#ff9800}
.device-card.critical{border-left-color:#f44336}
.device-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.device-name{font-weight:600;font-size:1.2em;color:#00d9ff}
.device-id{font-size:0.75em;color:#888;font-family:monospace}
.device-type{font-size:0.85em;color:#aaa;margin-bottom:10px;text-transform:uppercase}
.device-info{font-size:0.9em;margin:5px 0;color:#ccc;display:flex;justify-content:space-between}
.health-bar{width:100%;height:8px;background:#0f3460;border-radius:4px;margin-top:8px;overflow:hidden}
.health-fill{height:100%;background:#4caf50;transition:width 0.3s}
.weather-section{margin-top:12px;padding-top:12px;border-top:1px solid #0f3460}
.weather-item{display:flex;justify-content:space-between;margin:4px 0;font-size:0.85em;color:#ccc}
#map{width:100%;height:500px;border-radius:4px;z-index:1;background:#0a0e27;border:2px solid #0f3460;position:relative}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:15px;margin-bottom:20px}
.stat-box{background:#1a1a2e;padding:15px;border-radius:4px;text-align:center;border:1px solid #0f3460}
.stat-value{font-size:2em;font-weight:bold;color:#00d9ff}
.stat-label{font-size:0.9em;color:#aaa;margin-top:5px}
.leaflet-container{background:#0a0e27!important}
.leaflet-control-attribution{display:none!important}
.leaflet-control-zoom{background:#16213e!important;border:1px solid #0f3460!important}
.leaflet-control-zoom a{background:#16213e!important;color:#00d9ff!important;border-bottom:1px solid #0f3460!important}
.leaflet-control-zoom a:hover{background:#0f3460!important}
.leaflet-popup-content-wrapper{background:#16213e!important;color:#eee!important;border:1px solid #0f3460!important}
.leaflet-popup-tip{background:#16213e!important}
.map-controls{position:absolute;top:10px;right:10px;z-index:1000;background:#16213e;border:1px solid #0f3460;border-radius:4px;padding:10px;box-shadow:0 2px 8px rgba(0,0,0,0.3)}
.map-controls label{display:block;margin:8px 0;color:#eee;cursor:pointer;font-size:0.9em}
.map-controls input{margin-right:8px;cursor:pointer}
.weather-overlay{position:absolute;width:100%;height:100%;pointer-events:none;z-index:400}
.weather-zone{position:absolute;border-radius:50%;opacity:0.3;pointer-events:none;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold;font-size:0.8em}
</style>
</head><body>
<div class="header">
<h1>⚡ Power Grid Device Simulation</h1>
<p>Raven Substation - Real-time Monitoring & Weather Integration</p>
</div>
<div class="main">
<div class="card">
<h2>📊 System Status</h2>
<div class="stats" id="stats">Loading...</div>
</div>
<div class="card">
<h2>🗺️ Raven Substation - Geographic View</h2>
<div id="map">
<div class="map-controls">
<label><input type="checkbox" id="streetToggle" checked> Street View</label>
<label><input type="checkbox" id="weatherToggle"> Weather Overlay</label>
<label><input type="checkbox" id="gridToggle" checked> Grid Connections</label>
</div>
</div>
</div>
<div class="card">
<h2>🔌 Device Inventory</h2>
<div id="devices">Loading devices...</div>
</div>
</div>
<script>
const map = L.map('map', {
  zoomControl: true,
  attributionControl: false
}).setView([40.7128, -74.0060], 15);

const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: ''
}).addTo(map);

let gridLines = [];
let weatherOverlays = [];

const statusColors = {
  operational: '#4caf50',
  warning: '#ff9800',
  critical: '#f44336'
};

const typeIcons = {
  substation: '🏭',
  transformer: '⚡',
  circuit_breaker: '🔌',
  distribution_panel: '📊',
  capacitor_bank: '🔋',
  relay_protection: '🛡️',
  metering_unit: '📏',
  bus_bar: '🔗'
};

document.getElementById('streetToggle').addEventListener('change', function(e) {
  if(e.target.checked) {
    map.addLayer(streetLayer);
  } else {
    map.removeLayer(streetLayer);
  }
});

document.getElementById('gridToggle').addEventListener('change', function(e) {
  gridLines.forEach(line => {
    if(e.target.checked) {
      map.addLayer(line);
    } else {
      map.removeLayer(line);
    }
  });
});

document.getElementById('weatherToggle').addEventListener('change', function(e) {
  weatherOverlays.forEach(overlay => {
    overlay.style.display = e.target.checked ? 'block' : 'none';
  });
});

fetch('http://localhost:3000/api/devices').then(r=>r.json()).then(d=>{
  const devices=d.data;
  
  fetch('http://localhost:3000/api/devices/stats').then(r=>r.json()).then(s=>{
    const stats=s.data;
    document.getElementById('stats').innerHTML=
      '<div class="stat-box"><div class="stat-value">'+stats.total+'</div><div class="stat-label">Total Devices</div></div>'+
      '<div class="stat-box"><div class="stat-value" style="color:#4caf50">'+stats.operational+'</div><div class="stat-label">Operational</div></div>'+
      '<div class="stat-box"><div class="stat-value" style="color:#ff9800">'+stats.warning+'</div><div class="stat-label">Warning</div></div>'+
      '<div class="stat-box"><div class="stat-value" style="color:#f44336">'+stats.critical+'</div><div class="stat-label">Critical</div></div>'+
      '<div class="stat-box"><div class="stat-value">'+stats.avgHealth+'%</div><div class="stat-label">Avg Health</div></div>'+
      '<div class="stat-box"><div class="stat-value">'+stats.utilizationPercent+'%</div><div class="stat-label">Utilization</div></div>';
  });

  Promise.all(devices.map(dev=>
    fetch('http://localhost:3000/api/weather/current?latitude='+dev.latitude+'&longitude='+dev.longitude)
      .then(r=>r.json())
      .then(w=>({...dev,weather:w.data}))
      .catch(()=>dev)
  )).then(devicesWithWeather=>{
    
    devicesWithWeather.forEach((dev,idx)=>{
      const color = statusColors[dev.status];
      const icon = L.divIcon({
        html: '<div style="position:relative"><div style="background:'+color+';width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid #00d9ff;box-shadow:0 0 20px '+color+',0 0 40px '+color+';font-size:20px">'+typeIcons[dev.type]+'</div><div style="position:absolute;top:-25px;left:50%;transform:translateX(-50%);background:#16213e;color:#00d9ff;padding:2px 6px;border-radius:3px;font-size:11px;font-weight:bold;border:1px solid #0f3460;white-space:nowrap">'+dev.name+'</div></div>',
        className: '',
        iconSize: [40, 40]
      });
      
      const marker = L.marker([dev.latitude, dev.longitude], {icon: icon}).addTo(map);
      
      let popupContent = '<div style="min-width:220px">'+
        '<div style="font-size:1.1em;font-weight:bold;color:#00d9ff;margin-bottom:8px">'+typeIcons[dev.type]+' '+dev.name+'</div>'+
        '<div style="font-size:0.8em;color:#888;font-family:monospace;margin-bottom:8px">'+dev.id+'</div>'+
        '<div style="margin:4px 0"><strong>Type:</strong> '+dev.type.replace(/_/g,' ')+'</div>'+
        '<div style="margin:4px 0"><strong>Status:</strong> <span style="color:'+color+'">'+dev.status.toUpperCase()+'</span></div>'+
        '<div style="margin:4px 0"><strong>Health:</strong> '+dev.health+'%</div>'+
        '<div style="margin:4px 0"><strong>Load:</strong> '+dev.load+'/'+dev.capacity+' MW</div>'+
        '<div style="margin:4px 0"><strong>Voltage:</strong> '+dev.voltage+' kV</div>';
      
      if(dev.weather) {
        popupContent += '<div style="border-top:1px solid #0f3460;margin-top:8px;padding-top:8px">'+
          '<div style="font-weight:bold;color:#00d9ff;margin-bottom:4px">Weather:</div>'+
          '<div style="margin:2px 0">🌡️ '+dev.weather.temperature.toFixed(1)+'°C</div>'+
          '<div style="margin:2px 0">☁️ '+dev.weather.condition+'</div>'+
          '<div style="margin:2px 0">💧 '+dev.weather.humidity.toFixed(0)+'%</div>'+
          '<div style="margin:2px 0">💨 '+dev.weather.windSpeed.toFixed(1)+' m/s</div>'+
          '</div>';
        
        const weatherColor = dev.weather.temperature > 30 ? 'rgba(255,87,34,0.4)' : 
                            dev.weather.temperature < 10 ? 'rgba(33,150,243,0.4)' : 
                            'rgba(76,175,80,0.4)';
        
        const circle = L.circle([dev.latitude, dev.longitude], {
          color: weatherColor,
          fillColor: weatherColor,
          fillOpacity: 0.3,
          radius: 100,
          className: 'weather-circle'
        });
        circle.addTo(map);
        circle.getElement().style.display = 'none';
        weatherOverlays.push(circle.getElement());
      }
      
      popupContent += '</div>';
      marker.bindPopup(popupContent);
    });

    for(let i=0;i<devices.length-1;i++){
      for(let j=i+1;j<devices.length;j++){
        const dist = Math.sqrt(Math.pow(devices[i].latitude-devices[j].latitude,2)+Math.pow(devices[i].longitude-devices[j].longitude,2));
        if(dist < 0.01){
          const line = L.polyline(
            [[devices[i].latitude,devices[i].longitude],[devices[j].latitude,devices[j].longitude]],
            {color:'#0f3460',weight:2,opacity:0.6,dashArray:'5,10'}
          ).addTo(map);
          gridLines.push(line);
        }
      }
    }

    const bounds = L.latLngBounds(devices.map(d => [d.latitude, d.longitude]));
    map.fitBounds(bounds, {padding: [50, 50]});

    document.getElementById('devices').innerHTML='<div class="device-grid">'+devicesWithWeather.map(dev=>
      '<div class="device-card '+dev.status+'">'+
      '<div class="device-header">'+
      '<div><div class="device-name">'+typeIcons[dev.type]+' '+dev.name+'</div><div class="device-id">'+dev.id+'</div></div>'+
      '<div style="font-size:1.5em">'+typeIcons[dev.type]+'</div>'+
      '</div>'+
      '<div class="device-type">'+dev.type.replace(/_/g,' ')+'</div>'+
      '<div class="device-info"><span>Status:</span><span style="color:'+statusColors[dev.status]+';font-weight:600">'+dev.status.toUpperCase()+'</span></div>'+
      '<div class="device-info"><span>Substation:</span><span>'+dev.substation+'</span></div>'+
      '<div class="device-info"><span>Voltage:</span><span>'+dev.voltage+' kV</span></div>'+
      '<div class="device-info"><span>Load:</span><span>'+dev.load+'/'+dev.capacity+' MW</span></div>'+
      '<div class="device-info"><span>Temperature:</span><span>'+dev.temperature+'°C</span></div>'+
      '<div class="device-info"><span>Last Maintenance:</span><span>'+dev.lastMaintenance+'</span></div>'+
      '<div class="device-info"><span>Health:</span><span>'+dev.health+'%</span></div>'+
      '<div class="health-bar"><div class="health-fill" style="width:'+dev.health+'%;background:'+(dev.health>=75?'#4caf50':dev.health>=50?'#ff9800':'#f44336')+'"></div></div>'+
      (dev.weather?
        '<div class="weather-section"><strong style="color:#00d9ff">Weather Conditions:</strong>'+
        '<div class="weather-item"><span>🌡️ Temperature:</span><span>'+dev.weather.temperature.toFixed(1)+'°C</span></div>'+
        '<div class="weather-item"><span>☁️ Condition:</span><span>'+dev.weather.condition+'</span></div>'+
        '<div class="weather-item"><span>💧 Humidity:</span><span>'+dev.weather.humidity.toFixed(0)+'%</span></div>'+
        '<div class="weather-item"><span>💨 Wind Speed:</span><span>'+dev.weather.windSpeed.toFixed(1)+' m/s</span></div>'+
        '<div class="weather-item"><span>🔽 Pressure:</span><span>'+dev.weather.pressure+' hPa</span></div>'+
        '</div>'
      :'')+
      '</div>'
    ).join('')+'</div>';
  });
}).catch(e=>{
  document.getElementById('devices').innerHTML='<p style="color:#f44336;padding:20px">Error loading devices: '+e.message+'</p>';
  document.getElementById('stats').innerHTML='<p style="color:#f44336">Error loading stats</p>';
});
</script>
</body></html>`);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(PORT, '0.0.0.0', () => console.log('Server on http://localhost:' + PORT));
