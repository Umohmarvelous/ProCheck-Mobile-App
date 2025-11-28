/**
 * Small in-memory helper to pass password reset state between screens.
 * This avoids reliance on router search params in environments with differing expo-router versions.
 */
let resetEmail: string | null = null;
let resetCode: string | null = null;

export function setResetEmail(email: string) {
  resetEmail = email;
}

export function getResetEmail() {
  return resetEmail;
}

export function setResetCode(code: string) {
  resetCode = code;
}

export function getResetCode() {
  return resetCode;
}

export function clearReset() {
  resetEmail = null;
  resetCode = null;
}
