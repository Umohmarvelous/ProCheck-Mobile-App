import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { addList } from '../src/store/slices/workspaceSlice';
import { useRouter } from 'expo-router';

function makeId() {
  return String(Date.now()) + Math.random().toString(36).slice(2, 8);
}

export default function CreateTodosScreen() {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  const r: any = router;

  function onSubmit() {
    if (!name.trim()) return Alert.alert('Validation', 'Name is required');
    const id = makeId();
    dispatch(addList({ id, name: name.trim(), description: desc.trim(), createdAt: date || new Date().toISOString(), owner: 'me', items: [] }));
    Alert.alert('Todo created successfully');
  r.replace('/WorkSpace');
  }

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Create Todo List</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Description" value={desc} onChangeText={setDesc} style={styles.input} />
      <TextInput placeholder="Date (ISO or leave blank)" value={date} onChangeText={setDate} style={styles.input} />
      <TouchableOpacity onPress={onSubmit} style={styles.btn}><Text style={{ color: '#fff' }}>Create</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 8 },
  btn: { backgroundColor: '#0a84ff', padding: 14, borderRadius: 8, alignItems: 'center' },
});
