import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../src/store';
import { clearUser, updateProfile } from '../src/store/slices/authSlice';

export default function ProfileScreen() {
  const user = useSelector((s: RootState) => s.auth?.user);
  const [fullname, setFullname] = useState(user?.fullname || '');
  const [country, setCountry] = useState(user?.country || '');
  const dispatch = useDispatch();
  const router = useRouter();

  function onSave() {
    dispatch(updateProfile({ fullname: fullname.trim(), country: country.trim() }));
    Alert.alert('Saved');
  }

  function onSignOut() {
    dispatch(clearUser());
    router.replace('/SignInScreen');
  }

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.label}>Email</Text>
      <Text style={styles.value}>{user?.email}</Text>

      <Text style={styles.label}>Full name</Text>
      <TextInput value={fullname} onChangeText={setFullname} style={styles.input} />

      <Text style={styles.label}>Country</Text>
      <TextInput value={country} onChangeText={setCountry} style={styles.input} />

      <TouchableOpacity onPress={onSave} style={styles.btn}><Text style={{ color: '#fff' }}>Save</Text></TouchableOpacity>
      <TouchableOpacity onPress={onSignOut} style={[styles.btn, { backgroundColor: '#ff4d4f', marginTop: 12 }]}><Text style={{ color: '#fff' }}>Sign out</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 12 },
  label: { color: '#666', marginTop: 12 },
  value: { fontSize: 16, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8 },
  btn: { backgroundColor: '#0a84ff', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 16 },
});
