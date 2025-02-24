import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useColorScheme } from '@/hooks/useColorScheme';
import { MysticOverlay } from '@/components/MysticOverlay';

const customDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: 'transparent',
  },
};

const customLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 phút
      cacheTime: 1000 * 60 * 30, // 30 phút
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    async function prepare() {
      try {
        // Đợi fonts load xong
        if (!loaded) return;

        // Kiểm tra auth
        const token = await AsyncStorage.getItem('access_token');
        
        // Đánh dấu đã sẵn sàng
        setIsReady(true);

        // Điều hướng dựa trên trạng thái đăng nhập
        if (!token) {
          router.replace('/auth/login');
        }
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, [loaded]);

  if (!isReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? customDarkTheme : customLightTheme}>
        <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#3B0B45' : '#3B0B45' }]}>
          <View style={styles.backgroundContainer}>
            <MysticOverlay />
          </View>
          <View style={styles.contentContainer}>
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: 'transparent',
                },
                headerTransparent: true,
                contentStyle: {
                  backgroundColor: colorScheme === 'dark' ? '' : '',
                },
              }}>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="auth" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          </View>
        </View>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
