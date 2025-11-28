import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { setNewPassword } from '../src/services/auth';
import { useRouter } from 'expo-router';
import { getResetEmail, getResetCode, clearReset } from '../src/services/authTemp';

export default function NewPasswordScreen() {
  const emailParam = getResetEmail();
  const codeParam = getResetCode();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const router = useRouter();

  async function onSave() {
    setNetworkError(false);
    if (!emailParam || !codeParam) return Alert.alert('Missing data');
    if (password.length < 8) return Alert.alert('Password too short');
    if (password !== confirm) return Alert.alert('Passwords do not match');
    setLoading(true);
    try {
  await setNewPassword(String(emailParam), String(codeParam), password);
      Alert.alert('Password reset', 'You can now sign in');
      router.replace('/SignInScreen');
  clearReset();
    } catch (err: any) {
      if (err.message === 'NETWORK') setNetworkError(true);
      else Alert.alert('Error', err.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Choose a new password</Text>
      {networkError && <Text style={styles.networkError}>Loading Failed: Check your internet connection</Text>}
      <TextInput placeholder="New password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TextInput placeholder="Confirm password" value={confirm} onChangeText={setConfirm} secureTextEntry style={styles.input} />
      <TouchableOpacity onPress={onSave} style={styles.btn} disabled={!password || !confirm || loading}><Text style={{ color: '#fff' }}>{loading ? 'Saving…' : 'Save'}</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 8 },
  btn: { backgroundColor: '#0a84ff', padding: 14, borderRadius: 8, alignItems: 'center' },
  networkError: { color: '#b71c1c', marginBottom: 8, fontWeight: '700' },
});
