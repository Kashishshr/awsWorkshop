import { createReducer, on } from '@ngrx/store';
import { AppState, initialAppState } from './app.state';
import * as AppActions from './app.actions';

export const appReducer = createReducer(
  initialAppState,

  // User Actions
  on(AppActions.loginSuccess, (state, { user, accessToken, refreshToken }) => ({
    ...state,
    user: {
      ...state.user,
      authenticated: true,
      profile: user,
      permissions: user.permissions,
      loading: false,
      error: null,
    },
  })),

  on(AppActions.loginFailure, (state, { error }) => ({
    ...state,
    user: {
      ...state.user,
      authenticated: false,
      profile: null,
      permissions: [],
      loading: false,
      error,
    },
  })),

  on(AppActions.logout, (state) => ({
    ...state,
    user: {
      authenticated: false,
      profile: null,
      permissions: [],
      loading: false,
      error: null,
    },
  })),

  on(AppActions.loadUserProfile, (state) => ({
    ...state,
    user: {
      ...state.user,
      loading: true,
      error: null,
    },
  })),

  on(AppActions.loadUserProfileSuccess, (state, { user }) => ({
    ...state,
    user: {
      ...state.user,
      profile: user,
      permissions: user.permissions,
      loading: false,
      error: null,
    },
  })),

  on(AppActions.loadUserProfileFailure, (state, { error }) => ({
    ...state,
    user: {
      ...state.user,
      loading: false,
      error,
    },
  })),

  // UI Actions
  on(AppActions.selectDevice, (state, { deviceId }) => ({
    ...state,
    ui: {
      ...state.ui,
      selectedDeviceId: deviceId,
    },
  })),

  on(AppActions.clearSelectedDevice, (state) => ({
    ...state,
    ui: {
      ...state.ui,
      selectedDeviceId: null,
    },
  })),

  on(AppActions.setViewMode, (state, { viewMode }) => ({
    ...state,
    ui: {
      ...state.ui,
      viewMode,
    },
  })),

  on(AppActions.toggleSidebar, (state) => ({
    ...state,
    ui: {
      ...state.ui,
      sidebarOpen: !state.ui.sidebarOpen,
    },
  })),

  on(AppActions.setSidebarOpen, (state, { open }) => ({
    ...state,
    ui: {
      ...state.ui,
      sidebarOpen: open,
    },
  })),

  on(AppActions.setTheme, (state, { theme }) => ({
    ...state,
    ui: {
      ...state.ui,
      theme,
    },
  })),

  on(AppActions.toggleMobileMenu, (state) => ({
    ...state,
    ui: {
      ...state.ui,
      mobileMenuOpen: !state.ui.mobileMenuOpen,
    },
  })),

  // Settings Actions
  on(AppActions.setLanguage, (state, { language }) => ({
    ...state,
    settings: {
      ...state.settings,
      language,
    },
  })),

  on(AppActions.setNotifications, (state, { enabled }) => ({
    ...state,
    settings: {
      ...state.settings,
      notifications: enabled,
    },
  })),

  on(AppActions.setAutoRefresh, (state, { enabled }) => ({
    ...state,
    settings: {
      ...state.settings,
      autoRefresh: enabled,
    },
  })),

  on(AppActions.setRefreshInterval, (state, { interval }) => ({
    ...state,
    settings: {
      ...state.settings,
      refreshInterval: interval,
    },
  })),

  // Loading Actions
  on(AppActions.setGlobalLoading, (state, { loading }) => ({
    ...state,
    loading: {
      ...state.loading,
      global: loading,
    },
  })),

  on(AppActions.setKeyLoading, (state, { key, loading }) => ({
    ...state,
    loading: {
      ...state.loading,
      byKey: {
        ...state.loading.byKey,
        [key]: loading,
      },
    },
  })),

  on(AppActions.clearKeyLoading, (state, { key }) => {
    const { [key]: _, ...rest } = state.loading.byKey;
    return {
      ...state,
      loading: {
        ...state.loading,
        byKey: rest,
      },
    };
  }),

  // Error Actions
  on(AppActions.setGlobalError, (state, { error }) => ({
    ...state,
    error: {
      ...state.error,
      global: error,
    },
  })),

  on(AppActions.setKeyError, (state, { key, error }) => ({
    ...state,
    error: {
      ...state.error,
      byKey: {
        ...state.error.byKey,
        [key]: error,
      },
    },
  })),

  on(AppActions.clearKeyError, (state, { key }) => {
    const { [key]: _, ...rest } = state.error.byKey;
    return {
      ...state,
      error: {
        ...state.error,
        byKey: rest,
      },
    };
  }),

  on(AppActions.clearAllErrors, (state) => ({
    ...state,
    error: {
      global: null,
      byKey: {},
    },
  }))
);
