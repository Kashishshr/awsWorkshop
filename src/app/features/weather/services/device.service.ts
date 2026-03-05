import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Device {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  status: 'operational' | 'warning' | 'critical';
  health: number;
  capacity: number;
  load: number;
  temperature: number;
}

export interface DeviceStats {
  total: number;
  operational: number;
  warning: number;
  critical: number;
  avgHealth: number;
  totalCapacity: number;
  totalLoad: number;
  utilizationPercent: number;
}

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private apiUrl = 'http://localhost:3000/api/devices';

  constructor(private http: HttpClient) {}

  getAllDevices(): Observable<{ success: boolean; data: Device[]; count: number }> {
    return this.http.get<{ success: boolean; data: Device[]; count: number }>(`${this.apiUrl}`);
  }

  getDeviceById(deviceId: string): Observable<{ success: boolean; data: Device }> {
    return this.http.get<{ success: boolean; data: Device }>(`${this.apiUrl}/${deviceId}`);
  }

  getDevicesByStatus(status: string): Observable<{ success: boolean; data: Device[]; count: number }> {
    return this.http.get<{ success: boolean; data: Device[]; count: number }>(`${this.apiUrl}/status/${status}`);
  }

  getDeviceStats(): Observable<{ success: boolean; data: DeviceStats }> {
    return this.http.get<{ success: boolean; data: DeviceStats }>(`${this.apiUrl}/stats`);
  }

  getDevicesInBounds(minLat: number, maxLat: number, minLng: number, maxLng: number): Observable<{ success: boolean; data: Device[]; count: number }> {
    return this.http.get<{ success: boolean; data: Device[]; count: number }>(`${this.apiUrl}/bounds`, {
      params: { minLat, maxLat, minLng, maxLng }
    });
  }
}
