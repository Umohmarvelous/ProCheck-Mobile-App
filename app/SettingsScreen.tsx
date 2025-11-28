import React, { useCallback, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch, Picker } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../src/store';
import {
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
} from '../src/store/slices/settingsSlice';

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const settings = useSelector((s: RootState) => s.settings);

  // Use useCallback for toggle handlers
  const handleDarkModeToggle = useCallback(() => {
    dispatch(toggleDarkMode());
  }, [dispatch]);

  const handleThemeChange = useCallback((value: any) => {
    dispatch(setTheme(value));
  }, [dispatch]);

  const handleTextSizeChange = useCallback((value: any) => {
    dispatch(setTextSize(value));
  }, [dispatch]);

  const handleNotificationsToggle = useCallback(() => {
    dispatch(setNotificationsEnabled(!settings.notificationsEnabled));
  }, [dispatch, settings.notificationsEnabled]);

  const handleEmailNotificationsToggle = useCallback(() => {
    dispatch(setEmailNotifications(!settings.emailNotifications));
  }, [dispatch, settings.emailNotifications]);

  const handleAutoSyncToggle = useCallback(() => {
    dispatch(setAutoSync(!settings.autoSync));
  }, [dispatch, settings.autoSync]);

  const handleLanguageChange = useCallback((value: any) => {
    dispatch(setLanguage(value));
  }, [dispatch]);

  const handlePrivacyModeToggle = useCallback(() => {
    dispatch(setPrivacyMode(!settings.privacyMode));
  }, [dispatch, settings.privacyMode]);

  const handleDeletedAccountsSyncToggle = useCallback(() => {
    dispatch(setDeletedAccountsSync(!settings.deletedAccountsSync));
  }, [dispatch, settings.deletedAccountsSync]);

  const handleOfflineModeToggle = useCallback(() => {
    dispatch(setOfflineMode(!settings.offlineMode));
  }, [dispatch, settings.offlineMode]);

  const handleAnalyticsToggle = useCallback(() => {
    dispatch(setAnalyticsEnabled(!settings.analyticsEnabled));
  }, [dispatch, settings.analyticsEnabled]);

  const handleSyncIntervalChange = useCallback((value: any) => {
    dispatch(setSyncInterval(parseInt(value, 10)));
  }, [dispatch]);

  const handleResetSettings = useCallback(() => {
    dispatch(resetSettings());
  }, [dispatch]);

  // Memoize setting items for performance
  const settingItems = useMemo(() => [
    { label: 'Dark Mode', value: settings.darkMode, onToggle: handleDarkModeToggle, type: 'toggle' },
    { label: 'Theme', value: settings.theme, onChange: handleThemeChange, options: ['blue', 'green', 'purple'], type: 'picker' },
    { label: 'Text Size', value: settings.textSize, onChange: handleTextSizeChange, options: ['small', 'medium', 'large'], type: 'picker' },
    { label: 'Notifications', value: settings.notificationsEnabled, onToggle: handleNotificationsToggle, type: 'toggle' },
    { label: 'Email Notifications', value: settings.emailNotifications, onToggle: handleEmailNotificationsToggle, type: 'toggle' },
    { label: 'Auto Sync', value: settings.autoSync, onToggle: handleAutoSyncToggle, type: 'toggle' },
    { label: 'Language', value: settings.language, onChange: handleLanguageChange, options: ['en', 'es', 'fr', 'de'], type: 'picker' },
    { label: 'Privacy Mode', value: settings.privacyMode, onToggle: handlePrivacyModeToggle, type: 'toggle' },
    { label: 'Sync Deleted Accounts', value: settings.deletedAccountsSync, onToggle: handleDeletedAccountsSyncToggle, type: 'toggle' },
    { label: 'Offline Mode', value: settings.offlineMode, onToggle: handleOfflineModeToggle, type: 'toggle' },
    { label: 'Analytics', value: settings.analyticsEnabled, onToggle: handleAnalyticsToggle, type: 'toggle' },
    { label: 'Sync Interval (minutes)', value: settings.syncInterval, onChangeText: handleSyncIntervalChange, type: 'number' },
  ], [settings, handleDarkModeToggle, handleThemeChange, handleTextSizeChange, handleNotificationsToggle, handleEmailNotificationsToggle, handleAutoSyncToggle, handleLanguageChange, handlePrivacyModeToggle, handleDeletedAccountsSyncToggle, handleOfflineModeToggle, handleAnalyticsToggle, handleSyncIntervalChange]);

  return (
    <ScrollView style={styles.root}>
      <Text style={styles.title}>Settings</Text>

      {settingItems.map((item, idx) => (
        <View key={idx} style={styles.setting}>
          <Text style={styles.label}>{item.label}</Text>
          {item.type === 'toggle' && (
            <Switch value={item.value} onValueChange={item.onToggle} />
          )}
          {item.type === 'picker' && (
            <Picker selectedValue={item.value} onValueChange={item.onChange} style={styles.picker}>
              {item.options?.map((opt: any) => (
                <Picker.Item key={opt} label={opt} value={opt} />
              ))}
            </Picker>
          )}
          {item.type === 'number' && (
            <Text style={styles.value}>{item.value} min</Text>
          )}
        </View>
      ))}

      <TouchableOpacity onPress={handleResetSettings} style={styles.btn}>
        <Text style={{ color: '#fff' }}>Reset to Defaults</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  setting: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  label: { fontSize: 16, fontWeight: '600' },
  value: { fontSize: 14, color: '#666' },
  picker: { flex: 0.4, height: 40 },
  btn: { backgroundColor: '#0a84ff', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 20, marginBottom: 40 },
});
