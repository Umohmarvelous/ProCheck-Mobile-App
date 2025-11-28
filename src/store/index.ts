import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import todoReducer from './slices/todoSlice';
import authReducer from './slices/authSlice';
import workspaceReducer from './slices/workspaceSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['todo', 'auth'],
};

const rootReducer = combineReducers({
  todo: todoReducer,
  auth: authReducer,
  workspace: workspaceReducer,
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
