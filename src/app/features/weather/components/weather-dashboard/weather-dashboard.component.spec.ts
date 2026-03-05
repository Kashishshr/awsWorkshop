import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { WeatherDashboardComponent } from './weather-dashboard.component';
import { WeatherAlertComponent } from '../weather-alert/weather-alert.component';
import { CommonModule } from '@angular/common';

describe('WeatherDashboardComponent', () => {
  let component: WeatherDashboardComponent;
  let fixture: ComponentFixture<WeatherDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeatherDashboardComponent, WeatherAlertComponent],
      imports: [CommonModule, StoreModule.forRoot({})],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherDashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadWeatherData on init', () => {
    spyOn(component['store'], 'dispatch');
    component.ngOnInit();
    expect(component['store'].dispatch).toHaveBeenCalled();
  });

  it('should dispatch subscribeToAlerts on init', () => {
    spyOn(component['store'], 'dispatch');
    component.ngOnInit();
    expect(component['store'].dispatch).toHaveBeenCalled();
  });

  it('should dispatch loadWeatherData on refresh', () => {
    spyOn(component['store'], 'dispatch');
    component.onRefresh();
    expect(component['store'].dispatch).toHaveBeenCalled();
  });

  it('should dispatch setAutoRefresh action', () => {
    spyOn(component['store'], 'dispatch');
    component.onToggleAutoRefresh(true);
    expect(component['store'].dispatch).toHaveBeenCalled();
  });

  it('should dispatch setRefreshInterval action', () => {
    spyOn(component['store'], 'dispatch');
    component.onSetRefreshInterval(60000);
    expect(component['store'].dispatch).toHaveBeenCalled();
  });

  it('should have observables for weather data', () => {
    expect(component.currentWeather$).toBeDefined();
    expect(component.activeAlerts$).toBeDefined();
    expect(component.criticalAlerts$).toBeDefined();
    expect(component.loading$).toBeDefined();
    expect(component.error$).toBeDefined();
    expect(component.autoRefresh$).toBeDefined();
    expect(component.refreshInterval$).toBeDefined();
  });

  it('should render dashboard container', () => {
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('[data-testid="weather-dashboard-container"]');
    expect(container).toBeTruthy();
  });
});
