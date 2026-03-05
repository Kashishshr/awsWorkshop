import { User } from '../models/user.model';

export interface AppState {
  user: UserState;
  ui: UIState;
  settings: SettingsState;
  loading: LoadingState;
  error: ErrorState;
}

export interface UserState {
  authenticated: boolean;
  profile: User | null;
  permissions: string[];
  loading: boolean;
  error: string | null;
}

export interface UIState {
  selectedDeviceId: string | null;
  viewMode: 'map' | 'list' | 'grid';
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  mobileMenuOpen: boolean;
}

export interface SettingsState {
  language: string;
  notifications: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
}

export interface LoadingState {
  global: boolean;
  byKey: { [key: string]: boolean };
}

export interface ErrorState {
  global: string | null;
  byKey: { [key: string]: string };
}

export const initialAppState: AppState = {
  user: {
    authenticated: false,
    profile: null,
    permissions: [],
    loading: false,
    error: null,
  },
  ui: {
    selectedDeviceId: null,
    viewMode: 'map',
    sidebarOpen: true,
    theme: 'light',
    mobileMenuOpen: false,
  },
  settings: {
    language: 'en',
    notifications: true,
    autoRefresh: true,
    refreshInterval: 5000,
  },
  loading: {
    global: false,
    byKey: {},
  },
  error: {
    global: null,
    byKey: {},
  },
};
