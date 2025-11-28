import reducer, { clearUser, setUser, updateProfile } from '../src/store/slices/authSlice';

describe('auth slice', () => {
  it('sets and clears user', () => {
    const initial = { user: null, token: null };
    const next = reducer(initial as any, setUser({ user: { id: '1', email: 'a@b.com' }, token: 'tok' }));
    expect(next.user).not.toBeNull();
    expect(next.token).toBe('tok');
    const cleared = reducer(next as any, clearUser());
    expect(cleared.user).toBeNull();
    expect(cleared.token).toBeNull();
  });

  it('updates profile', () => {
    const state = { user: { id: '1', email: 'a@b.com', fullname: 'A' }, token: 't' };
    const next = reducer(state as any, updateProfile({ fullname: 'B' }));
    expect(next.user?.fullname).toBe('B');
  });
});
