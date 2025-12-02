import React, { useCallback, useRef, useState } from 'react';
import { Alert, Modal,  StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { requestAudioPermission, startAudioRecording, stopAudioRecording } from '../../src/services/audioRecorder';
import { addMediaToList } from '../../src/store/slices/workspaceSlice';
import { BlurView } from 'expo-blur';
import theme from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function RecordAudioModal({ visible, onClose, listId }: { visible: boolean; onClose: () => void; listId?: string }) {
  const [desc, setDesc] = useState('');
  const [recording, setRecording] = useState(false);
  const dispatch = useDispatch();
  const recordingRef = useRef<any>(null);

  const onStartRecord = useCallback(async () => {
    try {
      setRecording(true);
      await requestAudioPermission();
      const rec = await startAudioRecording();
      recordingRef.current = rec;
    } catch (err) {
      Alert.alert('Recording failed', (err as any).message || 'Could not start recording');
      setRecording(false);
    }
  }, []);

  const onStopRecord = useCallback(async () => {
    try {
      if (!recordingRef.current) return;
      const res = await stopAudioRecording();
      const item = {
        id: `audio-${Date.now()}`,
        title: desc || 'Audio note',
        createdAt: new Date().toISOString(),
        owner: 'me',
        description: res.uri,
      };
      dispatch(addMediaToList({ listId, item }));
      Alert.alert('Recorded', 'Audio recorded and added to workspace');
      setDesc('');
      recordingRef.current = null;
      setRecording(false);
      onClose();
    } catch (err) {
      Alert.alert('Recording failed', (err as any).message || 'Could not stop recording');
      setRecording(false);
    }
  }, [desc, dispatch, listId, onClose]);

  const handleClose = useCallback(() => {
    if (recording && recordingRef.current) {
      recordingRef.current.stopAndUnloadAsync().catch(() => {});
      setRecording(false);
    }
    onClose();
  }, [recording, onClose]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <BlurView intensity={60} tint="dark" style={[styles.bottomButton]}>

            <TouchableOpacity onPress={handleClose} style={[styles.closeBtn, { marginTop: 8 }]}>
              <Ionicons name="close-outline" size={20} color="#fff" />
            </TouchableOpacity>

              <Text style={styles.title}>Record Audio</Text>
            <View style={styles.box}>
              <Text style={styles.audioInputLabel}>Title</Text>
              <TextInput placeholder="" value={desc} onChangeText={setDesc} style={styles.input} />
              
              {!recording ? (
                <TouchableOpacity onPress={onStartRecord} style={styles.btn}>
                  <Text style={{ color: theme.dark.danger }}>Start</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={onStopRecord} style={[styles.btn, { backgroundColor: theme.dark.danger }]}>
                  <Text style={{ color: '#fff' }}>Stop</Text>
                </TouchableOpacity>
              )}

            </View>
          </BlurView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.82)', 
    justifyContent: 'center', 
    alignItems: 'center' ,
  },
  bottomButton: {
    width: 360,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    padding: 5,
    borderWidth: 1,
    borderColor: theme.dark.borderLight,
    borderRadius: theme.radius.extraLarge,
    overflow: "hidden",
    paddingBottom: 32

  },
    
  box: { 
    width: '90%', 
    paddingVertical: 40,
    borderRadius: 12,     
  },
  title: { 
    fontSize: 25, 
    fontWeight: '500', 
    marginBottom: 8 ,
    color: theme.dark.textSecondary
  },
  audioInputLabel:{
    color: theme.dark.check,
    paddingVertical: 5

  },
  input: { 
    borderWidth: 1, 
    borderColor: theme.dark.checkLight, 
    padding: 20, 
    borderRadius: theme.radius.large, 
    marginBottom: 12,
    color: theme.dark.textSecondary
  },
  btn: { 
    backgroundColor: theme.dark.glassDark, 
    padding: 12,
    marginTop: 10, 
    alignSelf:'center',
    borderRadius: theme.radius.large, 
    alignItems: 'center' ,
    width: 92,
    borderWidth: 1,
    borderColor: theme.dark.borderLight,
  },
  closeBtn:{
    padding: 12,
    marginRight: 5,
    borderRadius: 50,
    width: 'auto',
    alignSelf: 'flex-end',
    justifyContent:'center'
  }
});
