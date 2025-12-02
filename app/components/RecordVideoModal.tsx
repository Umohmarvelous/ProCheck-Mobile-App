import React, { useCallback, useRef, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { recordVideoSimulated } from '../../src/services/videoRecorder';
import { addMediaToList } from '../../src/store/slices/workspaceSlice';

export default function RecordVideoModal({ visible, onClose, listId }: { visible: boolean; onClose: () => void; listId?: string }) {
  const [desc, setDesc] = useState('');
  const [recording, setRecording] = useState(false);
  const dispatch = useDispatch();
  const recordingRef = useRef<any>(null);

  const onStartRecord = useCallback(async () => {
    setRecording(true);
    // In real implementation, initialize camera recording here
  }, []);

  const onStopRecord = useCallback(async () => {
    try {
      const res = await recordVideoSimulated(2000);
      const item = { id: `video-${Date.now()}`, title: desc || 'Video note', createdAt: new Date().toISOString(), owner: 'me', description: res.uri };
      dispatch(addMediaToList({ listId, item }));
      Alert.alert('Recorded', 'Video recorded and added to workspace');
      setDesc('');
      setRecording(false);
      onClose();
    } catch (err) {
      Alert.alert('Recording failed', (err as any).message || 'Could not record video');
      setRecording(false);
    }
  }, [desc, dispatch, listId, onClose]);

  const handleClose = useCallback(() => {
    if (recording) {
      recordingRef.current?.stopAsync().catch(() => {});
      setRecording(false);
    }
    onClose();
  }, [recording, onClose]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.box}>
          <Text style={styles.title}>Record Video</Text>
          <TextInput placeholder="Description (optional)" value={desc} onChangeText={setDesc} style={styles.input} />
          {!recording ? (
            <TouchableOpacity onPress={onStartRecord} style={styles.btn}>
              <Text style={{ color: '#fff' }}>Start Recording</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={onStopRecord} style={[styles.btn, { backgroundColor: '#ff4d4f' }]}>
              <Text style={{ color: '#fff' }}>Stop Recording</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleClose} style={[styles.btn, { backgroundColor: '#ccc', marginTop: 8 }]}><Text>Cancel</Text></TouchableOpacity>
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
