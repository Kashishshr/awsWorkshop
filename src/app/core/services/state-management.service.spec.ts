import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { StateManagementService } from './state-management.service';
import { AppState } from '../store/app.state';
import * as AppActions from '../store/app.actions';

describe('StateManagementService', () => {
  let service: StateManagementService;
  let store: jasmine.SpyObj<Store<AppState>>;

  beforeEach(() => {
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);

    TestBed.configureTestingModule({
      providers: [
        StateManagementService,
        { provide: Store, useValue: storeSpy },
      ],
    });

    service = TestBed.inject(StateManagementService);
    store = TestBed.inject(Store) as jasmine.SpyObj<Store<AppState>>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('dispatch', () => {
    it('should dispatch action to store', () => {
      const action = AppActions.setGlobalLoading({ loading: true });
      service.dispatch(action);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('select', () => {
    it('should select value from store', (done) => {
      const mockSelector = (state: AppState) => state.loading.global;
      store.select.and.returnValue(jasmine.createSpyObj('Observable', ['subscribe']));

      service.select(mockSelector);
      expect(store.select).toHaveBeenCalledWith(mockSelector);
      done();
    });
  });

  describe('getState', () => {
    it('should return app state observable', () => {
      service.getState();
      expect(store.select).toBeDefined();
    });
  });
});
