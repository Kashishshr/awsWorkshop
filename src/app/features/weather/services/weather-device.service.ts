import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeviceService, Device } from './device.service';

export interface DeviceWithWeather extends Device {
  weather?: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    pressure: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class WeatherDeviceService {
  private weatherApiUrl = 'http://localhost:3000/api/weather';

  constructor(
    private http: HttpClient,
    private deviceService: DeviceService
  ) {}

  /**
   * Get weather data for a specific location
   */
  getWeatherForLocation(latitude: number, longitude: number): Observable<any> {
    return this.http.get(`${this.weatherApiUrl}/current`, {
      params: {
        location: `${latitude},${longitude}`,
        latitude,
        longitude
      }
    });
  }

  /**
   * Get all devices with their weather data
   */
  getDevicesWithWeather(): Observable<DeviceWithWeather[]> {
    return this.deviceService.getAllDevices().pipe(
      map(response => {
        const devices = response.data;
        const weatherRequests = devices.map(device =>
          this.getWeatherForLocation(device.latitude, device.longitude).pipe(
            map(weatherResponse => ({
              ...device,
              weather: weatherResponse.data
            })),
            // Handle errors gracefully
            map(result => result, () => device)
          )
        );

        return forkJoin(weatherRequests);
      })
    );
  }

  /**
   * Get device with weather data
   */
  getDeviceWithWeather(deviceId: string): Observable<DeviceWithWeather> {
    return this.deviceService.getDeviceById(deviceId).pipe(
      map(response => {
        const device = response.data;
        return this.getWeatherForLocation(device.latitude, device.longitude).pipe(
          map(weatherResponse => ({
            ...device,
            weather: weatherResponse.data
          }))
        );
      })
    );
  }
}
