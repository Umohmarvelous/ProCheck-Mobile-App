import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { importTextAsList } from '../src/store/slices/workspaceSlice';
import { useRouter } from 'expo-router';

export default function ImportScreen() {
  const [name, setName] = useState('Imported Note');
  const [content, setContent] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  const r: any = router;

  function makeId() {
    return String(Date.now()) + Math.random().toString(36).slice(2, 8);
  }

  function onImport() {
    if (!content.trim()) return Alert.alert('Nothing to import');
    const id = makeId();
    dispatch(importTextAsList({ id, name: name || 'Imported', content: content.trim(), owner: 'me' }));
    Alert.alert('Import successful');
  r.replace('/WorkSpace');
  }

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Import .txt</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Paste file content here" value={content} onChangeText={setContent} style={[styles.input, { height: 160 }]} multiline />
      <TouchableOpacity onPress={onImport} style={styles.btn}><Text style={{ color: '#fff' }}>Import</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 8 },
  btn: { backgroundColor: '#0a84ff', padding: 14, borderRadius: 8, alignItems: 'center' },
});
