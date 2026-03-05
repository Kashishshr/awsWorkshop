import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WeatherState } from './store/weather.state';
import * as WeatherActions from './store/weather.actions';
import * as WeatherSelectors from './store/weather.selectors';
import { WeatherData, WeatherAlert } from './models/weather-alert.model';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent implements OnInit, OnDestroy {
  weatherData$: Observable<WeatherData | null>;
  alerts$: Observable<WeatherAlert[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  private destroy$ = new Subject<void>();

  constructor(private store: Store<{ weather: WeatherState }>) {
    this.weatherData$ = this.store.select(WeatherSelectors.selectCurrentWeather);
    this.alerts$ = this.store.select(WeatherSelectors.selectActiveAlerts);
    this.loading$ = this.store.select(WeatherSelectors.selectLoading);
    this.error$ = this.store.select(WeatherSelectors.selectError);
  }

  ngOnInit(): void {
    // Load initial weather data
    this.store.dispatch(WeatherActions.loadWeatherData());

    // Subscribe to alerts
    this.store.dispatch(WeatherActions.subscribeToAlerts());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refreshWeather(): void {
    this.store.dispatch(WeatherActions.loadWeatherData());
  }

  dismissAlert(alertId: string): void {
    this.store.dispatch(WeatherActions.dismissAlert({ alertId }));
  }
}
