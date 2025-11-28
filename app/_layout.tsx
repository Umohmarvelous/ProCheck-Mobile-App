import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Slot } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../src/store';
import { View } from 'react-native';
import HomeScreen from './screens/Home';
import SignInScreen from './SignInScreen';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <View style={{ flex: 1 }}>
            <Slot />
            {/* <SignInScreen /> */}
            <StatusBar style="auto" />
          </View>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
}
