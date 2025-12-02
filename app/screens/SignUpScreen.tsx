import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { signUp } from '../../src/services/auth';

function validateEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

function validatePassword(pw: string) {
  return pw.length >= 8;
}

export default function SignUpScreen() {
  const router = useRouter();
  const [fullname, setFullname] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  const emailValid = useMemo(() => validateEmail(email), [email]);
  const passwordValid = useMemo(() => validatePassword(password), [password]);

  const onSubmit = useCallback(async () => {
    setNetworkError(false);
    if (!emailValid || !passwordValid || !fullname.trim()) return;
    setLoading(true);
    try {
      await signUp({ fullname: fullname.trim(), country: country.trim(), email: email.trim(), password });
      Alert.alert('Account created', 'Please sign in');
      router.replace('/SignInScreen');
    } catch (err: any) {
      if (err.message === 'NETWORK') {
        setNetworkError(true);
      } else {
        Alert.alert('Sign up failed', err.message || 'Signup failed');
      }
    } finally {
      setLoading(false);
    }
  }, [fullname, country, email, password, emailValid, passwordValid, router]);

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Create an account</Text>
      {networkError && <Text style={styles.networkError}>Loading Failed: Check your internet connection</Text>}

      <TextInput placeholder="Full name" value={fullname} onChangeText={setFullname} style={styles.input} />
      <TextInput placeholder="Country" value={country} onChangeText={setCountry} style={styles.input} />

      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={[styles.input, !emailValid && email.length > 0 ? styles.inputError : null]} keyboardType="email-address" autoCapitalize="none" />
      {!emailValid && email.length > 0 && <Text style={styles.errorText}>Invalid email</Text>}

      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={[styles.input, !passwordValid && password.length > 0 ? styles.inputError : null]} secureTextEntry />
      {!passwordValid && password.length > 0 && <Text style={styles.errorText}>Invalid password (min 8 chars)</Text>}

      <TouchableOpacity onPress={onSubmit} disabled={!emailValid || !passwordValid || !fullname.trim() || loading} style={[styles.btn, (!emailValid || !passwordValid || !fullname.trim()) && styles.btnDisabled]}>
        <Text style={styles.btnText}>{loading ? 'Creating…' : 'Create account'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => (router.push('/SignInScreen') as any)} style={{ marginTop: 12 }}>
        <Text style={styles.link}>Already have an account? Sign in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 8 },
  inputError: { borderColor: '#f44336' },
  errorText: { color: '#f44336', marginBottom: 6 },
  btn: { backgroundColor: '#0a84ff', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontWeight: '700' },
  link: { color: '#0a84ff' },
  networkError: { color: '#b71c1c', marginBottom: 8, fontWeight: '700' },
});
