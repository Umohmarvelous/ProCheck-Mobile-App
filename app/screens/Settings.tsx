import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <BlurView intensity={30} style={styles.glass}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Preferences, integrations and account.</Text>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'transparent' },
  glass: { padding: 20, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.04)' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666' },
});
