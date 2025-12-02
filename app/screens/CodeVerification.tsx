import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { verifyCode } from '../../src/services/auth';
import { getResetEmail, setResetCode } from '../../src/services/authTemp';

export default function CodeVerification() {
  const emailParam = getResetEmail();
  const [code, setCode] = useState('');
  const [networkError, setNetworkError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onVerify() {
    setNetworkError(false);
    setLoading(true);
    try {
  if (!emailParam) throw new Error('Missing email');
  await verifyCode(String(emailParam), code.trim());
  setResetCode(code.trim());
  (router.push('/screens/NewPasswordScreen') as any);
    } catch (err: any) {
      if (err.message === 'NETWORK') setNetworkError(true);
      else Alert.alert('Verification failed', err.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Enter verification code</Text>
      {networkError && <Text style={styles.networkError}>Loading Failed: Check your internet connection</Text>}
      <Text style={{ marginBottom: 8 }}>Code sent to {emailParam}</Text>
      <TextInput placeholder="Code" value={code} onChangeText={setCode} style={styles.input} />
      <TouchableOpacity onPress={onVerify} style={styles.btn} disabled={!code || loading}><Text style={{ color: '#fff' }}>{loading ? 'Verifying…' : 'Verify'}</Text></TouchableOpacity>
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
