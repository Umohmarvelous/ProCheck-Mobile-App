/**
 * Document picker and file reading service
 */
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export async function pickAndReadTextFile() {
  try {
    const result = await DocumentPicker.getDocumentAsync({ type: 'text/*' });
    if (result.canceled || !result.assets.length) return null;
    const asset = result.assets[0];
    if (!asset.uri) throw new Error('No URI provided');
    
    // Read file content
    const content = await FileSystem.readAsStringAsync(asset.uri);
    return { name: asset.name || 'Imported', content };
  } catch (err) {
    console.warn('File picker error:', err);
    throw err;
  }
}
