/**
 * Real audio recording service using expo-av
 * Handles permissions, recording, and saving to file system.
 */
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

let recording: any = null;
let recordingDuration = 0;

export async function requestAudioPermission() {
  try {
    const result = await (Audio as any).requestPermissionsAsync?.() || { granted: true };
    const { granted } = result;
    if (!granted) throw new Error('Audio permission denied');
    await (Audio as any).setAudioModeAsync?.({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    return true;
  } catch (err) {
    console.warn('Audio permission error:', err);
    throw err;
  }
}

export async function startAudioRecording() {
  try {
    if (recording) await recording.stopAndUnloadAsync?.();
    const RecordingClass = (Audio as any).Recording;
    const rec = new RecordingClass();
    await rec?.prepareToRecordAsync?.((Audio as any).RecordingOptionsPresets?.HIGH_QUALITY);
    recordingDuration = 0;
    await rec?.startAsync?.();
    recording = rec;
    return rec;
  } catch (err) {
    console.warn('Recording start error:', err);
    throw err;
  }
}

export async function stopAudioRecording() {
  try {
    if (!recording) throw new Error('No recording in progress');
    await recording.stopAndUnloadAsync?.();
    const uri = recording.getURI?.();
    recordingDuration = recording.getDuration?.() || 0;
    const docDir = (FileSystem as any).documentDirectory || '';
    const newUri = docDir + `audio-${Date.now()}.m4a`;
    if (uri) await FileSystem.copyAsync?.({ from: uri, to: newUri });
    recording = null;
    return { uri: newUri, duration: recordingDuration };
  } catch (err) {
    console.warn('Recording stop error:', err);
    throw err;
  }
}

export async function recordAudioSimulated(durationMs = 2000) {
  // Fallback simulation
  await new Promise((r) => setTimeout(r, durationMs));
  return { uri: `file://simulated-audio-${Date.now()}.m4a`, duration: durationMs };
}
