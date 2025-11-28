import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUser } from '../src/store/slices/authSlice';
import { signIn } from '../src/services/auth';
import { useRouter } from 'expo-router';

function validateEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

function validatePassword(pw: string) {
  return pw.length >= 8;
}

export default function SignInScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  const emailValid = useMemo(() => validateEmail(email), [email]);
  const passwordValid = useMemo(() => validatePassword(password), [password]);

  const onSubmit = useCallback(async () => {
    setNetworkError(false);
    if (!emailValid || !passwordValid) return;
    setLoading(true);
    try {
      const user = await signIn(email.trim(), password);
  dispatch(setUser({ user: { id: user.id, fullname: user.fullname, email: user.email, country: user.country }, token: user.token }));
  // navigate to profile or root
  (router.replace('/ProfileScreen') as any);
    } catch (err: any) {
      if (err.message === 'NETWORK') {
        setNetworkError(true);
      } else {
        Alert.alert('Sign in failed', err.message || 'Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch, email, password, emailValid, passwordValid, router]);

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Sign in</Text>
      {networkError && <Text style={styles.networkError}>Loading Failed: Check your internet connection</Text>}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={[styles.input, !emailValid && email.length > 0 ? styles.inputError : null]}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {!emailValid && email.length > 0 && <Text style={styles.errorText}>Invalid email</Text>}

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={[styles.input, !passwordValid && password.length > 0 ? styles.inputError : null]}
        secureTextEntry
      />
      {!passwordValid && password.length > 0 && <Text style={styles.errorText}>Invalid password (min 8 chars)</Text>}

      <TouchableOpacity onPress={onSubmit} disabled={!emailValid || !passwordValid || loading} style={[styles.btn, (!emailValid || !passwordValid) && styles.btnDisabled]}>
        <Text style={styles.btnText}>{loading ? 'Signing in…' : 'Sign in'}</Text>
      </TouchableOpacity>

      <View style={styles.linksRow}>
          <TouchableOpacity onPress={() => (router.push('/SignUpScreen') as any)}>
            <Text style={styles.link}>Don’t have an account? Register here</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => (router.push('/ForgotEmailInput') as any)}>
            <Text style={styles.link}>Forgot password?</Text>
          </TouchableOpacity>
      </View>

      <View style={styles.socialBox}>
        <Text style={{ marginBottom: 8, color: '#666' }}>Or sign in with</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity style={styles.socialBtn} onPress={() => Alert.alert('Google signin placeholder')}><Text>Google</Text></TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn} onPress={() => Alert.alert('Apple signin placeholder')}><Text>Apple</Text></TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn} onPress={() => Alert.alert('Facebook signin placeholder')}><Text>Facebook</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 6 },
  inputError: { borderColor: '#f44336' },
  errorText: { color: '#f44336', marginBottom: 6 },
  btn: { backgroundColor: '#0a84ff', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontWeight: '700' },
  linksRow: { marginTop: 12 },
  link: { color: '#0a84ff', marginTop: 8 },
  socialBox: { marginTop: 20, alignItems: 'center' },
  socialBtn: { padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
  networkError: { color: '#b71c1c', marginBottom: 8, fontWeight: '700' },
});
