import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { WeatherRoutingModule } from './weather-routing.module';
import { WeatherComponent } from './weather.component';

// Store
import { weatherReducer } from './store/weather.reducer';
import { WeatherEffects } from './store/weather.effects';

// Services
import { WeatherApiService } from './services/weather-api.service';
import { WeatherAlertService } from './services/weather-alert.service';
import { WeatherCacheService } from './services/weather-cache.service';
import { WeatherWebSocketService } from './services/weather-websocket.service';

// Components
import { WeatherAlertComponent } from './components/weather-alert/weather-alert.component';
import { WeatherDashboardComponent } from './components/weather-dashboard/weather-dashboard.component';
import { WeatherMapComponent } from './components/weather-map/weather-map.component';

@NgModule({
  declarations: [
    WeatherComponent,
    WeatherAlertComponent,
    WeatherDashboardComponent,
    WeatherMapComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WeatherRoutingModule,
    StoreModule.forFeature('weather', weatherReducer),
    EffectsModule.forFeature([WeatherEffects]),
  ],
  providers: [
    WeatherApiService,
    WeatherAlertService,
    WeatherCacheService,
    WeatherWebSocketService,
  ],
})
export class WeatherModule {}
