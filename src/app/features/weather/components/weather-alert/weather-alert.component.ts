import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { WeatherAlert, AlertSeverity } from '../../models/weather-alert.model';

@Component({
  selector: 'app-weather-alert',
  templateUrl: './weather-alert.component.html',
  styleUrls: ['./weather-alert.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherAlertComponent {
  @Input() alert: WeatherAlert | null = null;
  @Output() dismiss = new EventEmitter<void>();

  get severityClass(): string {
    if (!this.alert) return '';
    return `severity-${this.alert.severity}`;
  }

  get isExpired(): boolean {
    if (!this.alert) return false;
    return new Date() > new Date(this.alert.endTime);
  }

  onDismiss(): void {
    this.dismiss.emit();
  }

  getTimeRemaining(): string {
    if (!this.alert) return '';
    const now = new Date();
    const end = new Date(this.alert.endTime);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  }
}
