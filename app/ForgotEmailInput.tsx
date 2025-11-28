import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { requestPasswordReset } from '../src/services/auth';
import { setResetEmail } from '../src/services/authTemp';

export default function ForgotEmailInput() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const router = useRouter();

  async function send() {
    setNetworkError(false);
    setLoading(true);
  try {
  await requestPasswordReset(email.trim());
  setResetEmail(email.trim());
  Alert.alert('Code sent', 'Check your email for a verification code');
  (router.push('/CodeVerification') as any);
    } catch (err: any) {
      if (err.message === 'NETWORK') setNetworkError(true);
      else Alert.alert('Error', err.message || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Reset password</Text>
      {networkError && <Text style={styles.networkError}>Loading Failed: Check your internet connection</Text>}
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
      <TouchableOpacity onPress={send} style={styles.btn} disabled={!email || loading}><Text style={{ color: '#fff' }}>{loading ? 'Sending…' : 'Send code'}</Text></TouchableOpacity>
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
