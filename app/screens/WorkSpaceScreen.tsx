import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import Fuse from 'fuse.js';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { GlassTheme } from '../../constants/theme';
import { RootState } from '../../src/store';
import { deleteList } from '../../src/store/slices/workspaceSlice';
import RecordAudioModal from '../components/RecordAudioModal';
import RecordVideoModal from '../components/RecordVideoModal';

const styles = StyleSheet.create({
  root: { 
    flex: 1, 
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  headerGlass: {
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...GlassTheme.light.shadow?.subtle,
  },
  headerRow: { 
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: { 
    fontSize: 12,
    fontWeight: '600',
  },
  title: { 
    fontSize: 26, 
    fontWeight: '700',
    marginTop: 4,
  },
  searchGlass: {
    borderRadius: 12,
    marginVertical: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...GlassTheme.light.shadow?.subtle,
  },
  search: { 
    borderWidth: 1,
    padding: 12,
    fontSize: 15,
    margin: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  filters: { 
    marginVertical: 10,
    marginHorizontal: 8,
  },
  filterBoxGlass: {
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  filterBoxActive: {
    borderColor: GlassTheme.light.primary,
    borderWidth: 2,
  },
  filterText: {
    textTransform: 'capitalize',
    fontWeight: '600',
    color: GlassTheme.light.textSecondary,
    fontSize: 13,
  },
  emptyGlass: {
    margin: 12,
    padding: 24,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  listName: { 
    fontSize: 16, 
    fontWeight: '700',
    marginBottom: 4,
  },
  meta: { 
    fontSize: 12,
  },
  action: { 
    padding: 10,
    paddingHorizontal: 12,
  },
  addWrap: { 
    position: 'absolute', 
    right: 20, 
    bottom: 28, 
    alignItems: 'center' 
  },
  addBtn: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  dropdownGlass: { 
    position: 'absolute', 
    bottom: 75, 
    right: 0,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  dropItem: { 
    paddingVertical: 12, 
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
});

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
  const theme = GlassTheme.light;

  // Memoize Fuse index for performance
  const fuse = useMemo(() => {
    return new Fuse(lists, { keys: ['name', 'description'], threshold: 0.3 });
  }, [lists]);

  const filtered = useMemo(() => {
    let results = query ? fuse.search(query).map((res) => res.item) : lists;
    
    if (filter === 'recent') {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      results = results.filter((l) => new Date(l.createdAt) > d);
    }
    return results;
  }, [lists, query, filter, fuse]);

  const onDelete = useCallback((id: string) => {
    Alert.alert('Delete list', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => dispatch(deleteList({ id })) },
    ]);
  }, [dispatch]);

  const handleFilterToggle = useCallback((f: string) => {
    setFilter(filter === f ? null : f);
  }, [filter]);

  return (
    <SafeAreaView style={styles.root}>
      <BlurView intensity={25} style={styles.headerGlass}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerLeft, { color: theme.textSecondary }]}>Dashboard</Text>
          <Text style={[styles.title, { color: theme.text }]}>WorkSpace</Text>
        </View>
      </BlurView>

      <BlurView intensity={30} style={styles.searchGlass}>
        <TextInput 
          placeholder="Search notes" 
          value={query} 
          onChangeText={setQuery} 
          style={[styles.search, { color: theme.text, borderColor: theme.borderLight }]}
          placeholderTextColor={theme.textTertiary}
        />
      </BlurView>

      <ScrollView horizontal style={styles.filters} showsHorizontalScrollIndicator={false}>
        {['recent', 'all', 'starred', 'archived'].map((f) => (
          <BlurView key={f} intensity={35} style={[styles.filterBoxGlass, filter === f && styles.filterBoxActive]}>
            <TouchableOpacity onPress={() => handleFilterToggle(f)}>
              <Text style={[styles.filterText, filter === f && { color: theme.primary, fontWeight: '700' }]}>
                {f}
              </Text>
            </TouchableOpacity>
          </BlurView>
        ))}
      </ScrollView>

      <View style={{ flex: 1 }}>
        {filtered.length === 0 ? (
          <BlurView intensity={20} style={styles.emptyGlass}>
            <Text style={{ color: theme.textSecondary }}>No lists found</Text>
          </BlurView>
        ) : (
          <FlatList 
            data={filtered} 
            keyExtractor={(i) => i.id} 
            renderItem={({ item }) => (
              <BlurView intensity={40} style={styles.listRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.listName, { color: theme.text }]}>{item.name}</Text>
                  <Text style={[styles.meta, { color: theme.textSecondary }]}>
                    {new Date(item.createdAt).toLocaleString()} — {item.owner}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => r.push(`/Workspace/${item.id}`)} style={styles.action}>
                  <Text style={{ color: theme.primary, fontWeight: '600' }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete(item.id)} style={[styles.action, { marginLeft: 8 }]}>
                  <Text style={{ color: theme.danger, fontWeight: '600' }}>Delete</Text>
                </TouchableOpacity>
              </BlurView>
            )}
          />
        )}
      </View>

      <View style={styles.addWrap}>
        <TouchableOpacity onPress={() => setAddOpen((s) => !s)} style={[styles.addBtn, { backgroundColor: theme.primary }]}>
          <Text style={{ color: '#fff', fontSize: 26, fontWeight: '700' }}>+</Text>
        </TouchableOpacity>
        {addOpen && (
          <BlurView intensity={50} style={styles.dropdownGlass}>
            <TouchableOpacity onPress={() => (r.push('/ImportScreen'), setAddOpen(false))} style={styles.dropItem}>
              <Text style={{ color: theme.text, fontWeight: '500' }}>Import</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => (r.push('/CreateTodosScreen'), setAddOpen(false))} style={styles.dropItem}>
              <Text style={{ color: theme.text, fontWeight: '500' }}>Create Todos</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => (setAudioOpen(true), setAddOpen(false))} style={styles.dropItem}>
              <Text style={{ color: theme.text, fontWeight: '500' }}>Record Audio</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => (setVideoOpen(true), setAddOpen(false))} style={styles.dropItem}>
              <Text style={{ color: theme.text, fontWeight: '500' }}>Record Video</Text>
            </TouchableOpacity>
          </BlurView>
        )}
      </View>

      <RecordAudioModal visible={audioOpen} onClose={() => setAudioOpen(false)} />
      <RecordVideoModal visible={videoOpen} onClose={() => setVideoOpen(false)} />
    </SafeAreaView>
  );
}
