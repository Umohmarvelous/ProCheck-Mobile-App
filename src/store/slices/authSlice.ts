import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type User = {
  id: string;
  fullname?: string;
  email: string;
  country?: string;
};

type State = {
  user: User | null;
  token?: string | null;
};

const initialState: State = { user: null, token: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ user: User; token?: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token || null;
    },
    clearUser(state) {
      state.user = null;
      state.token = null;
    },
    updateProfile(state, action: PayloadAction<Partial<User>>) {
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload } as User;
    },
  },
});

export const { setUser, clearUser, updateProfile } = authSlice.actions;
export default authSlice.reducer;
