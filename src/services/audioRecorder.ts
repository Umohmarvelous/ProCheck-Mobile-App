/**
 * Real audio recording service using expo-av
 * Handles permissions, recording, and saving to file system.
 */
import * as Audio from 'expo-av';
import * as FileSystem from 'expo-file-system';

let recording: Audio.Recording | null = null;

export async function requestAudioPermission() {
  try {
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) throw new Error('Audio permission denied');
    await Audio.setAudioModeAsync({
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
    if (recording) await recording.stopAndUnloadAsync();
    const rec = new Audio.Recording();
    await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    await rec.startAsync();
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
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    const newUri = FileSystem.documentDirectory + `audio-${Date.now()}.m4a`;
    if (uri) await FileSystem.copyAsync({ from: uri, to: newUri });
    recording = null;
    return { uri: newUri, duration: recording?.getDuration?.() || 0 };
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
