import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { WeatherState } from '../../store/weather.state';
import * as WeatherSelectors from '../../store/weather.selectors';
import * as WeatherActions from '../../store/weather.actions';
import { CurrentWeather, WeatherAlert } from '../../models/weather-alert.model';

@Component({
  selector: 'app-weather-dashboard',
  templateUrl: './weather-dashboard.component.html',
  styleUrls: ['./weather-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherDashboardComponent implements OnInit {
  currentWeather$: Observable<CurrentWeather | null>;
  activeAlerts$: Observable<WeatherAlert[]>;
  criticalAlerts$: Observable<WeatherAlert[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  autoRefresh$: Observable<boolean>;
  refreshInterval$: Observable<number>;

  constructor(private store: Store<{ weather: WeatherState }>) {
    this.currentWeather$ = this.store.select(WeatherSelectors.selectCurrentWeather);
    this.activeAlerts$ = this.store.select(WeatherSelectors.selectActiveAlerts);
    this.criticalAlerts$ = this.store.select(WeatherSelectors.selectCriticalAlerts);
    this.loading$ = this.store.select(WeatherSelectors.selectLoading);
    this.error$ = this.store.select(WeatherSelectors.selectError);
    this.autoRefresh$ = this.store.select(WeatherSelectors.selectAutoRefresh);
    this.refreshInterval$ = this.store.select(WeatherSelectors.selectRefreshInterval);
  }

  ngOnInit(): void {
    this.store.dispatch(WeatherActions.loadWeatherData());
    this.store.dispatch(WeatherActions.subscribeToAlerts());
  }

  onRefresh(): void {
    this.store.dispatch(WeatherActions.loadWeatherData());
  }

  onToggleAutoRefresh(enabled: boolean): void {
    this.store.dispatch(WeatherActions.setAutoRefresh({ enabled }));
  }

  onSetRefreshInterval(interval: number): void {
    this.store.dispatch(WeatherActions.setRefreshInterval({ interval }));
  }

  onDismissAlert(alert: WeatherAlert): void {
    this.store.dispatch(WeatherActions.dismissAlert({ alertId: alert.id }));
  }

  onAcknowledgeAlert(alert: WeatherAlert): void {
    this.store.dispatch(WeatherActions.acknowledgeAlert({ alertId: alert.id }));
  }
}
