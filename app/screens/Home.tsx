import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../src/store';
import { addTodo, removeTodo, setTodos, Todo, toggleTodo } from '../../src/store/slices/todoSlice';
import { deleteTodo, getAllTodos, initDb, insertTodo, updateTodoCompletion } from '../../src/utils/sqlite';

function makeId() {
  return String(Date.now()) + Math.random().toString(36).slice(2, 8);
}

export default function HomeScreen() {
  const todos = useSelector((s: RootState) => s.todo.items);
  const dispatch = useDispatch();
  const [text, setText] = useState('');

  useEffect(() => {
    (async () => {
      try {
        await initDb();
        const rows = await getAllTodos();
        // map completed integer to boolean
        const items: Todo[] = rows.map((r) => ({ id: r.id, title: r.title, completed: !!r.completed, createdAt: r.createdAt }));
        dispatch(setTodos(items));
      } catch (err) {
        console.warn('DB init/load failed', err);
      }
    })();
  }, [dispatch]);

  const onAdd = useCallback(async () => {
    if (!text.trim()) return;
    const id = makeId();
    const title = text.trim();
    try {
      await insertTodo(id, title, 0);
      dispatch(addTodo({ id, title }));
      setText('');
    } catch (err) {
      Alert.alert('Error', 'Failed to add todo');
      console.warn(err);
    }
  }, [text, dispatch]);

  const onToggle = useCallback(async (id: string) => {
    try {
      const t = todos.find((x) => x.id === id);
      if (!t) return;
      const newCompleted = t.completed ? 0 : 1;
      await updateTodoCompletion(id, newCompleted);
      dispatch(toggleTodo({ id }));
    } catch (err) {
      console.warn(err);
    }
  }, [todos, dispatch]);

  const onDelete = useCallback(async (id: string) => {
    try {
      await deleteTodo(id);
      dispatch(removeTodo({ id }));
    } catch (err) {
      console.warn(err);
    }
  }, [dispatch]);

  const renderItem = ({ item }: { item: Todo }) => (
    <View style={styles.row}>
      <TouchableOpacity onPress={() => onToggle(item.id)} style={styles.checkbox}>
        <Text>{item.completed ? '✓' : ''}</Text>
      </TouchableOpacity>
      <Text style={[styles.itemText, item.completed && styles.completed]}>{item.title}</Text>
      <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.del}>
        <Text style={{ color: '#ff4d4f' }}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Home</Text>
        <Text style={styles.subtitle}>Your tasks and quick insights live here.</Text>
      </View>

      <View style={styles.inputRow}>
        <TextInput placeholder="New todo" value={text} onChangeText={setText} style={styles.input} />
        <TouchableOpacity onPress={onAdd} style={styles.addBtn}>
          <Text style={{ color: '#fff' }}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList data={todos} keyExtractor={(i) => i.id} renderItem={renderItem} contentContainerStyle={{ paddingBottom: 40 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'transparent' },
  header: { marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#666' },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginRight: 8 },
  addBtn: { backgroundColor: '#0a84ff', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  checkbox: { width: 28, height: 28, borderRadius: 6, borderWidth: 1, borderColor: '#ccc', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  itemText: { flex: 1, fontSize: 16 },
  completed: { textDecorationLine: 'line-through', color: '#999' },
  del: { paddingHorizontal: 10 },
});
