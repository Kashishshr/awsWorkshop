import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as AppActions from './app.actions';

@Injectable()
export class AppEffects {
  loadUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadUserProfile),
      switchMap(() => {
        // TODO: Implement user profile loading from API
        return of().pipe(
          map(() => AppActions.loadUserProfileSuccess({ user: null as any })),
          catchError((error) =>
            of(AppActions.loadUserProfileFailure({ error: error.message }))
          )
        );
      })
    )
  );

  constructor(private actions$: Actions) {}
}
