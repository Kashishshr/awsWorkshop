import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
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

  constructor(private store: Store<{ weather: WeatherState }>) {
    this.currentWeather$ = this.store.select(WeatherSelectors.selectCurrentWeather);
    this.activeAlerts$ = this.store.select(WeatherSelectors.selectActiveAlerts);
  }

  ngOnInit(): void {
    this.initializeMap();
    this.subscribeToWeatherUpdates();
  }

  private initializeMap(): void {
    // Initialize map with default center (will be updated with weather data)
    this.map = L.map('map-container').setView([20, 0], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);
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
}
