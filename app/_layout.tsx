import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '../src/store';
import { ScheduleProvider } from '@/context/ScheduleContext';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();
  

// SplashScreen.setOptions({
//   duration: 1000,
//   fade: true,
// });

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    async function doAsyncStuff() {
      try {
        // do something async here
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }

    doAsyncStuff();
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (   
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
      <ScheduleProvider>

          <SafeAreaView style={{ flex: 1, backgroundColor: '#212121ff' }}>
                <Stack screenOptions={{ 
                  headerShown: false,
                  animation: 'slide_from_right',
                  animationDuration: 800,
                 }}>
                </Stack>
            <StatusBar style='light'/>
          </SafeAreaView>
                </ScheduleProvider>

        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
}
// slide-from-right