import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import authReducer from './slices/authSlice';
import settingsReducer from './slices/settingsSlice';
import todoReducer from './slices/todoSlice';
import workspaceReducer from './slices/workspaceSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['todo', 'auth', 'workspace', 'settings'],
};

const rootReducer = combineReducers({
  todo: todoReducer,
  auth: authReducer,
  workspace: workspaceReducer,
  settings: settingsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer as any);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
