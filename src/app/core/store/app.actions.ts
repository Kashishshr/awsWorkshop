import { createAction, props } from '@ngrx/store';
import { User } from '../models/user.model';

// User Actions
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; accessToken: string; refreshToken: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');

export const loadUserProfile = createAction('[User] Load Profile');

export const loadUserProfileSuccess = createAction(
  '[User] Load Profile Success',
  props<{ user: User }>()
);

export const loadUserProfileFailure = createAction(
  '[User] Load Profile Failure',
  props<{ error: string }>()
);

// UI Actions
export const selectDevice = createAction(
  '[UI] Select Device',
  props<{ deviceId: string }>()
);

export const clearSelectedDevice = createAction('[UI] Clear Selected Device');

export const setViewMode = createAction(
  '[UI] Set View Mode',
  props<{ viewMode: 'map' | 'list' | 'grid' }>()
);

export const toggleSidebar = createAction('[UI] Toggle Sidebar');

export const setSidebarOpen = createAction(
  '[UI] Set Sidebar Open',
  props<{ open: boolean }>()
);

export const setTheme = createAction(
  '[UI] Set Theme',
  props<{ theme: 'light' | 'dark' }>()
);

export const toggleMobileMenu = createAction('[UI] Toggle Mobile Menu');

// Settings Actions
export const setLanguage = createAction(
  '[Settings] Set Language',
  props<{ language: string }>()
);

export const setNotifications = createAction(
  '[Settings] Set Notifications',
  props<{ enabled: boolean }>()
);

export const setAutoRefresh = createAction(
  '[Settings] Set Auto Refresh',
  props<{ enabled: boolean }>()
);

export const setRefreshInterval = createAction(
  '[Settings] Set Refresh Interval',
  props<{ interval: number }>()
);

// Loading Actions
export const setGlobalLoading = createAction(
  '[Loading] Set Global Loading',
  props<{ loading: boolean }>()
);

export const setKeyLoading = createAction(
  '[Loading] Set Key Loading',
  props<{ key: string; loading: boolean }>()
);

export const clearKeyLoading = createAction(
  '[Loading] Clear Key Loading',
  props<{ key: string }>()
);

// Error Actions
export const setGlobalError = createAction(
  '[Error] Set Global Error',
  props<{ error: string | null }>()
);

export const setKeyError = createAction(
  '[Error] Set Key Error',
  props<{ key: string; error: string }>()
);

export const clearKeyError = createAction(
  '[Error] Clear Key Error',
  props<{ key: string }>()
);

export const clearAllErrors = createAction('[Error] Clear All Errors');
