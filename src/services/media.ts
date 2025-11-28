/**
 * Placeholder media recording/import service. Real implementations will require native modules and permissions.
 */

export async function recordAudioSimulated(durationMs = 2000) {
  // simulate recording delay
  await new Promise((r) => setTimeout(r, durationMs));
  // return a fake URI
  return { uri: `file://simulated-audio-${Date.now()}.m4a`, duration: durationMs };
}

export async function recordVideoSimulated(durationMs = 3000) {
  await new Promise((r) => setTimeout(r, durationMs));
  return { uri: `file://simulated-video-${Date.now()}.mp4`, duration: durationMs };
}
