import React, { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../src/store';
import {
  resetSettings,
  setAnalyticsEnabled,
  setAutoSync,
  setDeletedAccountsSync,
  setEmailNotifications,
  setLanguage,
  setNotificationsEnabled,
  setOfflineMode,
  setPrivacyMode,
  setSyncInterval,
  setTextSize,
  setTheme,
  toggleDarkMode,
} from '../../src/store/slices/settingsSlice';

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
    { label: 'Dark Mode', value: settings.darkMode, onToggle: handleDarkModeToggle, type: 'toggle' as const },
    { label: 'Theme', value: settings.theme, onChange: handleThemeChange, options: ['blue', 'green', 'purple'], type: 'picker' as const },
    { label: 'Text Size', value: settings.textSize, onChange: handleTextSizeChange, options: ['small', 'medium', 'large'], type: 'picker' as const },
    { label: 'Notifications', value: settings.notificationsEnabled, onToggle: handleNotificationsToggle, type: 'toggle' as const },
    { label: 'Email Notifications', value: settings.emailNotifications, onToggle: handleEmailNotificationsToggle, type: 'toggle' as const },
    { label: 'Auto Sync', value: settings.autoSync, onToggle: handleAutoSyncToggle, type: 'toggle' as const },
    { label: 'Language', value: settings.language, onChange: handleLanguageChange, options: ['en', 'es', 'fr', 'de'], type: 'picker' as const },
    { label: 'Privacy Mode', value: settings.privacyMode, onToggle: handlePrivacyModeToggle, type: 'toggle' as const },
    { label: 'Sync Deleted Accounts', value: settings.deletedAccountsSync, onToggle: handleDeletedAccountsSyncToggle, type: 'toggle' as const },
    { label: 'Offline Mode', value: settings.offlineMode, onToggle: handleOfflineModeToggle, type: 'toggle' as const },
    { label: 'Analytics', value: settings.analyticsEnabled, onToggle: handleAnalyticsToggle, type: 'toggle' as const },
    { label: 'Sync Interval (minutes)', value: settings.syncInterval, onChangeText: handleSyncIntervalChange, type: 'number' as const },
  ], [settings, handleDarkModeToggle, handleThemeChange, handleTextSizeChange, handleNotificationsToggle, handleEmailNotificationsToggle, handleAutoSyncToggle, handleLanguageChange, handlePrivacyModeToggle, handleDeletedAccountsSyncToggle, handleOfflineModeToggle, handleAnalyticsToggle, handleSyncIntervalChange]);

  return (
    <ScrollView style={styles.root}>
      <Text style={styles.title}>Settings</Text>

      {settingItems.map((item, idx) => (
        <View key={idx} style={styles.setting}>
          <Text style={styles.label}>{item.label}</Text>
          {item.type === 'toggle' && (
            <Switch value={typeof item.value === 'boolean' ? item.value : false} onValueChange={item.onToggle as (value: boolean) => void} />
          )}
          {item.type === 'picker' && (
            <TouchableOpacity style={styles.pickerBtn} onPress={() => item.onChange?.(item.options?.[0])}>
              <Text style={styles.pickerText}>{item.value}</Text>
            </TouchableOpacity>
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
  root: { flex: 1, padding: 16, backgroundColor: '' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  setting: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  label: { fontSize: 16, fontWeight: '600' },
  value: { fontSize: 14, color: '#666' },
  picker: { flex: 0.4, height: 40 },
  pickerBtn: { backgroundColor: '#f0f0f0', padding: 8, borderRadius: 6 },
  pickerText: { fontSize: 14, color: '#333', textTransform: 'capitalize' },
  btn: { backgroundColor: '#0a84ff', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 20, marginBottom: 40 },
});
