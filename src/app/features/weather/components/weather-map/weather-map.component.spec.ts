import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { WeatherMapComponent } from './weather-map.component';
import { CommonModule } from '@angular/common';

describe('WeatherMapComponent', () => {
  let component: WeatherMapComponent;
  let fixture: ComponentFixture<WeatherMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeatherMapComponent],
      imports: [CommonModule, StoreModule.forRoot({})],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherMapComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have observables for weather data', () => {
    expect(component.currentWeather$).toBeDefined();
    expect(component.activeAlerts$).toBeDefined();
  });

  it('should render map container', () => {
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('[data-testid="weather-map-container"]');
    expect(container).toBeTruthy();
  });

  it('should have zoom controls', () => {
    fixture.detectChanges();
    const zoomInBtn = fixture.nativeElement.querySelector('[data-testid="weather-map-zoom-in-btn"]');
    const zoomOutBtn = fixture.nativeElement.querySelector('[data-testid="weather-map-zoom-out-btn"]');
    const resetBtn = fixture.nativeElement.querySelector('[data-testid="weather-map-reset-view-btn"]');

    expect(zoomInBtn).toBeTruthy();
    expect(zoomOutBtn).toBeTruthy();
    expect(resetBtn).toBeTruthy();
  });

  it('should call onZoomIn when zoom in button clicked', () => {
    spyOn(component, 'onZoomIn');
    fixture.detectChanges();

    const zoomInBtn = fixture.nativeElement.querySelector('[data-testid="weather-map-zoom-in-btn"]');
    zoomInBtn.click();

    expect(component.onZoomIn).toHaveBeenCalled();
  });

  it('should call onZoomOut when zoom out button clicked', () => {
    spyOn(component, 'onZoomOut');
    fixture.detectChanges();

    const zoomOutBtn = fixture.nativeElement.querySelector('[data-testid="weather-map-zoom-out-btn"]');
    zoomOutBtn.click();

    expect(component.onZoomOut).toHaveBeenCalled();
  });

  it('should call onResetView when reset button clicked', () => {
    spyOn(component, 'onResetView');
    fixture.detectChanges();

    const resetBtn = fixture.nativeElement.querySelector('[data-testid="weather-map-reset-view-btn"]');
    resetBtn.click();

    expect(component.onResetView).toHaveBeenCalled();
  });

  it('should display map legend', () => {
    fixture.detectChanges();
    const legend = fixture.nativeElement.querySelector('.map-legend');
    expect(legend).toBeTruthy();
  });
});
