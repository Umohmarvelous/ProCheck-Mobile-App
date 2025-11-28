import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../src/store';
import { deleteList } from '../src/store/slices/workspaceSlice';
import RecordAudioModal from './components/RecordAudioModal';
import RecordVideoModal from './components/RecordVideoModal';

function fuzzyMatch(text: string, query: string) {
  text = text.toLowerCase();
  query = query.toLowerCase();
  if (!query) return true;
  // simple fuzzy: all characters in query appear in order in text
  let qi = 0;
  for (let i = 0; i < text.length && qi < query.length; i++) {
    if (text[i] === query[qi]) qi++;
  }
  return qi === query.length;
}

export default function WorkSpaceScreen() {
  const lists = useSelector((s: RootState) => s.workspace?.lists || []);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [audioOpen, setAudioOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const r: any = router;

  const filtered = useMemo(() => {
    return lists.filter((l) => {
      if (filter === 'recent') {
        // keep only last 7 days
        const d = new Date(l.createdAt);
        if ((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24) > 7) return false;
      }
      // search by name or description
      return fuzzyMatch(l.name + ' ' + (l.description || ''), query);
    });
  }, [lists, query, filter]);

  function onDelete(id: string) {
    Alert.alert('Delete list', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => dispatch(deleteList({ id })) },
    ]);
  }

  return (
    <View style={styles.root}>
      <View style={styles.headerRow}>
        <Text style={styles.headerLeft}>Dashboard</Text>
        <Text style={styles.title}>WorkSpace</Text>
      </View>

      <TextInput placeholder="Search notes" value={query} onChangeText={setQuery} style={styles.search} />

      <ScrollView horizontal style={styles.filters} showsHorizontalScrollIndicator={false}>
        {['recent', 'all', 'starred', 'archived'].map((f) => (
          <TouchableOpacity key={f} style={[styles.filterBox, filter === f && { borderColor: '#0a84ff' }]} onPress={() => setFilter(filter === f ? null : f)}>
            <Text style={{ textTransform: 'capitalize' }}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={{ flex: 1 }}>
        {filtered.length === 0 ? (
          <View style={{ padding: 20 }}><Text>Not found</Text></View>
        ) : (
          <FlatList data={filtered} keyExtractor={(i) => i.id} renderItem={({ item }) => (
            <View style={styles.listRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.listName}>{item.name}</Text>
                <Text style={styles.meta}>{new Date(item.createdAt).toLocaleString()} — {item.owner}</Text>
              </View>
              <TouchableOpacity onPress={() => r.push(`/Workspace/${item.id}`)} style={styles.action}><Text>Edit</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => onDelete(item.id)} style={[styles.action, { marginLeft: 8 }]}><Text style={{ color: '#ff4d4f' }}>Delete</Text></TouchableOpacity>
            </View>
          )} />
        )}
      </View>

      <View style={styles.addWrap}>
        <TouchableOpacity onPress={() => setAddOpen((s) => !s)} style={styles.addBtn}><Text style={{ color: '#fff', fontSize: 24 }}>+</Text></TouchableOpacity>
        {addOpen && (
          <View style={styles.dropdown}>
            <TouchableOpacity onPress={() => (r.push('/ImportScreen'), setAddOpen(false))} style={styles.dropItem}><Text>Import</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => (r.push('/CreateTodosScreen'), setAddOpen(false))} style={styles.dropItem}><Text>Create Todos</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => (setAudioOpen(true), setAddOpen(false))} style={styles.dropItem}><Text>Record Audio</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => (setVideoOpen(true), setAddOpen(false))} style={styles.dropItem}><Text>Record Video</Text></TouchableOpacity>
          </View>
        )}
      </View>

      <RecordAudioModal visible={audioOpen} onClose={() => setAudioOpen(false)} />
      <RecordVideoModal visible={videoOpen} onClose={() => setVideoOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16 },
  headerRow: { marginBottom: 8 },
  headerLeft: { color: '#666', fontSize: 12 },
  title: { fontSize: 22, fontWeight: '700' },
  search: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, marginVertical: 8 },
  filters: { marginVertical: 8 },
  filterBox: { width: 100, height: 60, borderRadius: 12, borderWidth: 1, borderColor: '#eee', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  listRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  listName: { fontSize: 16, fontWeight: '600' },
  meta: { color: '#888', fontSize: 12 },
  action: { padding: 8 },
  addWrap: { position: 'absolute', right: 16, bottom: 28, alignItems: 'center' },
  addBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#0a84ff', justifyContent: 'center', alignItems: 'center' },
  dropdown: { position: 'absolute', bottom: 70, right: 0, backgroundColor: '#fff', padding: 8, borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6 },
  dropItem: { paddingVertical: 8, paddingHorizontal: 12 },
});
