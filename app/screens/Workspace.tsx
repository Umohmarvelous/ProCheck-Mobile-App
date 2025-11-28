import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function WorkspaceScreen() {
  return (
    <View style={styles.container}>
      <BlurView intensity={40} style={styles.glass}>
        <Text style={styles.title}>Workspace</Text>
        <Text style={styles.subtitle}>Projects, Collections and team spaces.</Text>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'transparent' },
  glass: { padding: 20, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.05)' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666' },
});
