import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../store/app.state';
import { Action } from '@ngrx/store';
import { MemoizedSelector } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class StateManagementService {
  constructor(private store: Store<AppState>) {}

  /**
   * Dispatch an action to the store
   */
  dispatch(action: Action): void {
    this.store.dispatch(action);
  }

  /**
   * Select a value from the store
   */
  select<T>(selector: MemoizedSelector<AppState, T>): Observable<T> {
    return this.store.select(selector);
  }

  /**
   * Get a snapshot of the current state
   */
  selectSnapshot<T>(selector: MemoizedSelector<AppState, T>): T {
    let value: T;
    this.store.select(selector).subscribe((v) => {
      value = v;
    });
    return value!;
  }

  /**
   * Get the entire app state
   */
  getState(): Observable<AppState> {
    return this.store;
  }
}
