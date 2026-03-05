import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { WeatherState } from '../../store/weather.state';
import * as WeatherSelectors from '../../store/weather.selectors';
import { CurrentWeather, WeatherAlert } from '../../models/weather-alert.model';

declare let L: any; // Leaflet library

@Component({
  selector: 'app-weather-map',
  templateUrl: './weather-map.component.html',
  styleUrls: ['./weather-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherMapComponent implements OnInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  currentWeather$: Observable<CurrentWeather | null>;
  activeAlerts$: Observable<WeatherAlert[]>;
  map: any;
  weatherMarker: any;
  alertMarkers: any[] = [];
  isDarkTheme = true;
  showLabels = true;
  tileLayer: any;
  currentBasemap = 'terrain'; // terrain, dark, light, satellite, watercolor
  showBasemapSelector = false;

  constructor(
    private store: Store<{ weather: WeatherState }>,
    private cdr: ChangeDetectorRef
  ) {
    this.currentWeather$ = this.store.select(WeatherSelectors.selectCurrentWeather);
    this.activeAlerts$ = this.store.select(WeatherSelectors.selectActiveAlerts);
  }

  ngOnInit(): void {
    this.initializeMap();
    this.subscribeToWeatherUpdates();
  }

  private initializeMap(): void {
    // Initialize map with default center (will be updated with weather data)
    this.map = L.map('map-container', {
      zoomControl: false, // We'll add custom controls
      attributionControl: true,
    }).setView([20, 0], 4);

    // Apply initial theme
    this.applyMapTheme();
  }

  private applyMapTheme(): void {
    // Remove existing tile layer if present
    if (this.tileLayer) {
      this.map.removeLayer(this.tileLayer);
    }

    // Select basemap based on current selection
    switch (this.currentBasemap) {
      case 'terrain':
        // Terrain with hillshading - similar to Felt's beautiful terrain view
        this.tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
          attribution: '© Esri, USGS, NOAA',
          maxZoom: 13,
        });
        this.isDarkTheme = false;
        break;
      
      case 'satellite':
        // Satellite imagery
        this.tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: '© Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN',
          maxZoom: 19,
        });
        this.isDarkTheme = true;
        break;
      
      case 'watercolor':
        // Artistic watercolor style
        this.tileLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg', {
          attribution: '© Stamen Design, © OpenStreetMap contributors',
          maxZoom: 16,
        });
        this.isDarkTheme = false;
        break;
      
      case 'dark':
        // Dark theme using CartoDB Dark Matter
        this.tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '© OpenStreetMap contributors © CARTO',
          maxZoom: 19,
          subdomains: 'abcd',
        });
        this.isDarkTheme = true;
        break;
      
      case 'light':
      default:
        // Light theme using CartoDB Positron
        this.tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '© OpenStreetMap contributors © CARTO',
          maxZoom: 19,
          subdomains: 'abcd',
        });
        this.isDarkTheme = false;
        break;
    }

    this.tileLayer.addTo(this.map);
  }

  private subscribeToWeatherUpdates(): void {
    this.currentWeather$.subscribe((weather) => {
      if (weather) {
        this.updateWeatherMarker(weather);
      }
    });

    this.activeAlerts$.subscribe((alerts) => {
      this.updateAlertMarkers(alerts);
    });
  }

  private updateWeatherMarker(weather: CurrentWeather): void {
    // Remove existing marker
    if (this.weatherMarker) {
      this.map.removeLayer(this.weatherMarker);
    }

    // Create new marker (using approximate coordinates for demo)
    const lat = 20 + Math.random() * 40;
    const lng = -50 + Math.random() * 100;

    const weatherIcon = L.divIcon({
      html: `<div class="weather-marker" data-testid="weather-map-weather-marker">
        <div class="weather-icon">🌡️</div>
        <div class="weather-temp">${weather.temperature}°C</div>
      </div>`,
      className: 'weather-marker-container',
      iconSize: [80, 80],
    });

    this.weatherMarker = L.marker([lat, lng], { icon: weatherIcon }).addTo(this.map);
    this.weatherMarker.bindPopup(`
      <div class="marker-popup">
        <h3>${weather.location}</h3>
        <p>Temperature: ${weather.temperature}°C</p>
        <p>Condition: ${weather.condition}</p>
        <p>Humidity: ${weather.humidity}%</p>
      </div>
    `);

    this.map.setView([lat, lng], 6);
  }

  private updateAlertMarkers(alerts: WeatherAlert[]): void {
    // Remove existing alert markers
    this.alertMarkers.forEach((marker) => {
      this.map.removeLayer(marker);
    });
    this.alertMarkers = [];

    // Add new alert markers
    alerts.forEach((alert) => {
      const lat = 20 + Math.random() * 40;
      const lng = -50 + Math.random() * 100;

      const severityColor = this.getSeverityColor(alert.severity);
      const alertIcon = L.divIcon({
        html: `<div class="alert-marker" data-testid="weather-map-alert-marker" style="background-color: ${severityColor}">
          ⚠️
        </div>`,
        className: 'alert-marker-container',
        iconSize: [40, 40],
      });

      const marker = L.marker([lat, lng], { icon: alertIcon }).addTo(this.map);
      marker.bindPopup(`
        <div class="marker-popup">
          <h3>${alert.type}</h3>
          <p>Severity: ${alert.severity}</p>
          <p>Location: ${alert.location}</p>
          <p>Description: ${alert.description}</p>
        </div>
      `);

      this.alertMarkers.push(marker);
    });
  }

  private getSeverityColor(severity: string): string {
    const colors: { [key: string]: string } = {
      critical: '#d32f2f',
      high: '#f57c00',
      moderate: '#fbc02d',
      low: '#388e3c',
    };
    return colors[severity.toLowerCase()] || '#999';
  }

  onZoomIn(): void {
    this.map.zoomIn();
  }

  onZoomOut(): void {
    this.map.zoomOut();
  }

  onResetView(): void {
    this.map.setView([20, 0], 4);
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.currentBasemap = this.isDarkTheme ? 'dark' : 'light';
    this.applyMapTheme();
    this.cdr.markForCheck();
  }

  toggleLabels(): void {
    this.showLabels = !this.showLabels;
    this.applyMapTheme();
    this.cdr.markForCheck();
  }

  toggleBasemapSelector(): void {
    this.showBasemapSelector = !this.showBasemapSelector;
    this.cdr.markForCheck();
  }

  selectBasemap(basemap: string): void {
    this.currentBasemap = basemap;
    this.applyMapTheme();
    this.showBasemapSelector = false;
    this.cdr.markForCheck();
  }

  getBasemapName(): string {
    const names: { [key: string]: string } = {
      terrain: 'Terrain',
      satellite: 'Satellite',
      watercolor: 'Watercolor',
      dark: 'Dark',
      light: 'Light',
    };
    return names[this.currentBasemap] || 'Terrain';
  }
}
