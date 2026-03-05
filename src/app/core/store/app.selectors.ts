import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState, UserState, UIState, SettingsState, LoadingState, ErrorState } from './app.state';

// Feature selectors
export const selectAppState = createFeatureSelector<AppState>('app');

export const selectUserState = createSelector(selectAppState, (state) => state.user);
export const selectUIState = createSelector(selectAppState, (state) => state.ui);
export const selectSettingsState = createSelector(selectAppState, (state) => state.settings);
export const selectLoadingState = createSelector(selectAppState, (state) => state.loading);
export const selectErrorState = createSelector(selectAppState, (state) => state.error);

// User selectors
export const selectIsAuthenticated = createSelector(
  selectUserState,
  (state: UserState) => state.authenticated
);

export const selectUserProfile = createSelector(
  selectUserState,
  (state: UserState) => state.profile
);

export const selectUserPermissions = createSelector(
  selectUserState,
  (state: UserState) => state.permissions
);

export const selectUserLoading = createSelector(
  selectUserState,
  (state: UserState) => state.loading
);

export const selectUserError = createSelector(
  selectUserState,
  (state: UserState) => state.error
);

export const selectHasPermission = (permission: string) =>
  createSelector(selectUserPermissions, (permissions) => permissions.includes(permission));

// UI selectors
export const selectSelectedDeviceId = createSelector(
  selectUIState,
  (state: UIState) => state.selectedDeviceId
);

export const selectViewMode = createSelector(
  selectUIState,
  (state: UIState) => state.viewMode
);

export const selectSidebarOpen = createSelector(
  selectUIState,
  (state: UIState) => state.sidebarOpen
);

export const selectTheme = createSelector(
  selectUIState,
  (state: UIState) => state.theme
);

export const selectMobileMenuOpen = createSelector(
  selectUIState,
  (state: UIState) => state.mobileMenuOpen
);

// Settings selectors
export const selectLanguage = createSelector(
  selectSettingsState,
  (state: SettingsState) => state.language
);

export const selectNotificationsEnabled = createSelector(
  selectSettingsState,
  (state: SettingsState) => state.notifications
);

export const selectAutoRefresh = createSelector(
  selectSettingsState,
  (state: SettingsState) => state.autoRefresh
);

export const selectRefreshInterval = createSelector(
  selectSettingsState,
  (state: SettingsState) => state.refreshInterval
);

// Loading selectors
export const selectGlobalLoading = createSelector(
  selectLoadingState,
  (state: LoadingState) => state.global
);

export const selectKeyLoading = (key: string) =>
  createSelector(selectLoadingState, (state: LoadingState) => state.byKey[key] || false);

export const selectAnyLoading = createSelector(
  selectLoadingState,
  (state: LoadingState) => state.global || Object.values(state.byKey).some((v) => v)
);

// Error selectors
export const selectGlobalError = createSelector(
  selectErrorState,
  (state: ErrorState) => state.global
);

export const selectKeyError = (key: string) =>
  createSelector(selectErrorState, (state: ErrorState) => state.byKey[key] || null);

export const selectHasErrors = createSelector(
  selectErrorState,
  (state: ErrorState) => state.global !== null || Object.keys(state.byKey).length > 0
);
