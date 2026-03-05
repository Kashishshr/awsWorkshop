import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, interval } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as WeatherActions from './weather.actions';
import { WeatherApiService } from '../services/weather-api.service';
import { WeatherWebSocketService } from '../services/weather-websocket.service';
import { selectAutoRefresh, selectRefreshInterval } from './weather.selectors';

@Injectable()
export class WeatherEffects {
  loadWeatherData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WeatherActions.loadWeatherData),
      switchMap(() =>
        this.weatherApiService.getCurrentWeather().pipe(
          map((weatherData) =>
            WeatherActions.loadWeatherDataSuccess({ weatherData })
          ),
          catchError((error) =>
            of(
              WeatherActions.loadWeatherDataFailure({
                error: error.message,
              })
            )
          )
        )
      )
    )
  );

  subscribeToAlerts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WeatherActions.subscribeToAlerts),
      switchMap(() =>
        this.weatherWebSocketService.subscribeToAlerts().pipe(
          map(() => WeatherActions.subscribeToAlertsSuccess()),
          catchError((error) =>
            of(
              WeatherActions.subscribeToAlertsFailure({
                error: error.message,
              })
            )
          )
        )
      )
    )
  );

  receiveAlert$ = createEffect(() =>
    this.weatherWebSocketService.onAlert().pipe(
      map((alert) => WeatherActions.receiveAlert({ alert }))
    )
  );

  autoRefresh$ = createEffect(() =>
    this.store.select(selectAutoRefresh).pipe(
      switchMap((autoRefresh) => {
        if (!autoRefresh) {
          return of();
        }

        return this.store.select(selectRefreshInterval).pipe(
          switchMap((interval) =>
            interval(interval).pipe(
              map(() => WeatherActions.loadWeatherData())
            )
          )
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private weatherApiService: WeatherApiService,
    private weatherWebSocketService: WeatherWebSocketService
  ) {}
}
