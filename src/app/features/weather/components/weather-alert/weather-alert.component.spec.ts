import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherAlertComponent } from './weather-alert.component';
import { WeatherAlert, AlertSeverity, AlertType } from '../../models/weather-alert.model';

describe('WeatherAlertComponent', () => {
  let component: WeatherAlertComponent;
  let fixture: ComponentFixture<WeatherAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeatherAlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherAlertComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display alert when provided', () => {
    const mockAlert: WeatherAlert = {
      id: '1',
      type: AlertType.THUNDERSTORM,
      severity: AlertSeverity.HIGH,
      description: 'Severe thunderstorm warning',
      location: 'North Region',
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 3600000).toISOString(),
      affectedDevices: ['Device-1', 'Device-2'],
    };

    component.alert = mockAlert;
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('[data-testid="weather-alert-container"]');
    expect(container).toBeTruthy();
  });

  it('should not display alert when null', () => {
    component.alert = null;
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('[data-testid="weather-alert-container"]');
    expect(container).toBeFalsy();
  });

  it('should apply correct severity class', () => {
    const mockAlert: WeatherAlert = {
      id: '1',
      type: AlertType.THUNDERSTORM,
      severity: AlertSeverity.CRITICAL,
      description: 'Critical alert',
      location: 'North Region',
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 3600000).toISOString(),
      affectedDevices: [],
    };

    component.alert = mockAlert;
    expect(component.severityClass).toBe('severity-critical');
  });

  it('should emit dismiss event when dismiss button clicked', () => {
    spyOn(component.dismiss, 'emit');

    const mockAlert: WeatherAlert = {
      id: '1',
      type: AlertType.THUNDERSTORM,
      severity: AlertSeverity.HIGH,
      description: 'Test alert',
      location: 'North Region',
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 3600000).toISOString(),
      affectedDevices: [],
    };

    component.alert = mockAlert;
    fixture.detectChanges();

    const dismissBtn = fixture.nativeElement.querySelector('[data-testid="weather-alert-dismiss-btn"]');
    dismissBtn.click();

    expect(component.dismiss.emit).toHaveBeenCalled();
  });

  it('should calculate time remaining correctly', () => {
    const now = new Date();
    const endTime = new Date(now.getTime() + 3600000); // 1 hour from now

    const mockAlert: WeatherAlert = {
      id: '1',
      type: AlertType.THUNDERSTORM,
      severity: AlertSeverity.HIGH,
      description: 'Test alert',
      location: 'North Region',
      startTime: now.toISOString(),
      endTime: endTime.toISOString(),
      affectedDevices: [],
    };

    component.alert = mockAlert;
    const timeRemaining = component.getTimeRemaining();

    expect(timeRemaining).toContain('remaining');
  });

  it('should return "Expired" when alert end time has passed', () => {
    const now = new Date();
    const endTime = new Date(now.getTime() - 1000); // 1 second ago

    const mockAlert: WeatherAlert = {
      id: '1',
      type: AlertType.THUNDERSTORM,
      severity: AlertSeverity.HIGH,
      description: 'Test alert',
      location: 'North Region',
      startTime: new Date(now.getTime() - 3600000).toISOString(),
      endTime: endTime.toISOString(),
      affectedDevices: [],
    };

    component.alert = mockAlert;
    expect(component.getTimeRemaining()).toBe('Expired');
  });

  it('should not display expired alerts', () => {
    const now = new Date();
    const endTime = new Date(now.getTime() - 1000);

    const mockAlert: WeatherAlert = {
      id: '1',
      type: AlertType.THUNDERSTORM,
      severity: AlertSeverity.HIGH,
      description: 'Test alert',
      location: 'North Region',
      startTime: new Date(now.getTime() - 3600000).toISOString(),
      endTime: endTime.toISOString(),
      affectedDevices: [],
    };

    component.alert = mockAlert;
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('[data-testid="weather-alert-container"]');
    expect(container).toBeFalsy();
  });

  it('should display affected devices when provided', () => {
    const mockAlert: WeatherAlert = {
      id: '1',
      type: AlertType.THUNDERSTORM,
      severity: AlertSeverity.HIGH,
      description: 'Test alert',
      location: 'North Region',
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 3600000).toISOString(),
      affectedDevices: ['Device-1', 'Device-2', 'Device-3'],
    };

    component.alert = mockAlert;
    fixture.detectChanges();

    const deviceTags = fixture.nativeElement.querySelectorAll('[data-testid="weather-alert-device-tag"]');
    expect(deviceTags.length).toBe(3);
  });
});
