import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type State = {
  darkMode: boolean;
  theme: 'blue' | 'green' | 'purple';
  textSize: 'small' | 'medium' | 'large';
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  autoSync: boolean;
  syncInterval: number; // minutes
  language: 'en' | 'es' | 'fr' | 'de';
  privacyMode: boolean;
  deletedAccountsSync: boolean;
  offlineMode: boolean;
  analyticsEnabled: boolean;
};

const initialState: State = {
  darkMode: false,
  theme: 'blue',
  textSize: 'medium',
  notificationsEnabled: true,
  emailNotifications: true,
  autoSync: true,
  syncInterval: 5,
  language: 'en',
  privacyMode: false,
  deletedAccountsSync: true,
  offlineMode: false,
  analyticsEnabled: true,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
    },
    setTheme(state, action: PayloadAction<'blue' | 'green' | 'purple'>) {
      state.theme = action.payload;
    },
    setTextSize(state, action: PayloadAction<'small' | 'medium' | 'large'>) {
      state.textSize = action.payload;
    },
    setNotificationsEnabled(state, action: PayloadAction<boolean>) {
      state.notificationsEnabled = action.payload;
    },
    setEmailNotifications(state, action: PayloadAction<boolean>) {
      state.emailNotifications = action.payload;
    },
    setAutoSync(state, action: PayloadAction<boolean>) {
      state.autoSync = action.payload;
    },
    setSyncInterval(state, action: PayloadAction<number>) {
      state.syncInterval = action.payload;
    },
    setLanguage(state, action: PayloadAction<'en' | 'es' | 'fr' | 'de'>) {
      state.language = action.payload;
    },
    setPrivacyMode(state, action: PayloadAction<boolean>) {
      state.privacyMode = action.payload;
    },
    setDeletedAccountsSync(state, action: PayloadAction<boolean>) {
      state.deletedAccountsSync = action.payload;
    },
    setOfflineMode(state, action: PayloadAction<boolean>) {
      state.offlineMode = action.payload;
    },
    setAnalyticsEnabled(state, action: PayloadAction<boolean>) {
      state.analyticsEnabled = action.payload;
    },
    resetSettings(state) {
      return initialState;
    },
  },
});

export const {
  toggleDarkMode,
  setTheme,
  setTextSize,
  setNotificationsEnabled,
  setEmailNotifications,
  setAutoSync,
  setSyncInterval,
  setLanguage,
  setPrivacyMode,
  setDeletedAccountsSync,
  setOfflineMode,
  setAnalyticsEnabled,
  resetSettings,
} = settingsSlice.actions;
export default settingsSlice.reducer;
