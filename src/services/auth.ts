/**
 * Placeholder auth service. Replace fetch endpoints with your backend API.
 * Each function throws on network errors; caller can detect network failures and show offline messages.
 */

type SignInResp = { id: string; fullname?: string; email: string; country?: string; token?: string };

function isNetworkError(err: any) {
  // fetch throws TypeError on network failure in many environments
  return err instanceof TypeError || err?.message?.toLowerCase?.().includes('network');
}

export async function signIn(email: string, password: string): Promise<SignInResp> {
  try {
    // placeholder: replace with real POST to your server
    const res = await fetch(process.env.API_URL ? `${process.env.API_URL}/auth/signin` : '/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json?.message || 'Invalid credentials');
    }

    const json = await res.json().catch(() => ({}));
    return { id: json.id || String(Date.now()), fullname: json.fullname, email, country: json.country, token: json.token };
  } catch (err: any) {
    if (isNetworkError(err)) throw new Error('NETWORK');
    throw err;
  }
}

export async function signUp(payload: { fullname: string; country?: string; email: string; password: string }) {
  try {
    const res = await fetch(process.env.API_URL ? `${process.env.API_URL}/auth/signup` : '/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json?.message || 'Signup failed');
    }
    return true;
  } catch (err: any) {
    if (isNetworkError(err)) throw new Error('NETWORK');
    throw err;
  }
}

export async function requestPasswordReset(email: string) {
  try {
    const res = await fetch(process.env.API_URL ? `${process.env.API_URL}/auth/forgot` : '/auth/forgot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error('Failed');
    return true;
  } catch (err: any) {
    if (isNetworkError(err)) throw new Error('NETWORK');
    throw err;
  }
}

export async function verifyCode(email: string, code: string) {
  try {
    const res = await fetch(process.env.API_URL ? `${process.env.API_URL}/auth/verify` : '/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    if (!res.ok) throw new Error('Invalid code');
    return true;
  } catch (err: any) {
    if (isNetworkError(err)) throw new Error('NETWORK');
    throw err;
  }
}

export async function setNewPassword(email: string, code: string, password: string) {
  try {
    const res = await fetch(process.env.API_URL ? `${process.env.API_URL}/auth/reset` : '/auth/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, password }),
    });
    if (!res.ok) throw new Error('Reset failed');
    return true;
  } catch (err: any) {
    if (isNetworkError(err)) throw new Error('NETWORK');
    throw err;
  }
}
