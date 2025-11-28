import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { recordAudioSimulated } from '../../src/services/media';
import { useDispatch } from 'react-redux';
import { addMediaToList } from '../../src/store/slices/workspaceSlice';

export default function RecordAudioModal({ visible, onClose, listId }: { visible: boolean; onClose: () => void; listId?: string }) {
  const [desc, setDesc] = useState('');
  const [recording, setRecording] = useState(false);
  const dispatch = useDispatch();

  async function onRecord() {
    setRecording(true);
    try {
      const res = await recordAudioSimulated(1500);
      const item = { id: `audio-${Date.now()}`, title: desc || 'Audio note', createdAt: new Date().toISOString(), owner: 'me', description: res.uri };
      dispatch(addMediaToList({ listId, item }));
      Alert.alert('Recorded', 'Audio recorded and added to workspace');
      setDesc('');
      onClose();
    } catch (err) {
      Alert.alert('Recording failed');
    } finally {
      setRecording(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.box}>
          <Text style={styles.title}>Record Audio</Text>
          <TextInput placeholder="Description (optional)" value={desc} onChangeText={setDesc} style={styles.input} />
          <TouchableOpacity onPress={onRecord} style={[styles.btn, recording && { opacity: 0.6 }]} disabled={recording}>
            <Text style={{ color: '#fff' }}>{recording ? 'Recording…' : 'Start Recording'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={[styles.btn, { backgroundColor: '#ccc', marginTop: 8 }]}><Text>Close</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  box: { width: '90%', padding: 18, borderRadius: 12, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, marginBottom: 12 },
  btn: { backgroundColor: '#0a84ff', padding: 12, borderRadius: 8, alignItems: 'center' },
});
