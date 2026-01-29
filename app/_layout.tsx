// template
import {
  AlexBrush_400Regular,
  useFonts as useAlexBrush,
} from '@expo-google-fonts/alex-brush';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
  useFonts as usePlayfairDisplay,
} from '@expo-google-fonts/playfair-display';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserContext } from '@/context/UserContext';
import { AuthProvider } from '@/context/AuthContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { trpc, trpcClient } from '@/lib/trpc';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="menu" options={{ presentation: 'modal', animation: 'fade_from_bottom' }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      <Stack.Screen name="about" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="auth/login" options={{ animation: 'fade' }} />
      <Stack.Screen name="auth/signup" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="reader/[id]" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="reading/[id]" options={{ animation: 'slide_from_bottom', presentation: 'fullScreenModal' }} />
      <Stack.Screen name="chat/[id]" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="stream/[id]" options={{ animation: 'slide_from_bottom', presentation: 'fullScreenModal' }} />
      <Stack.Screen name="wallet/add-funds" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="wallet/transactions" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="settings/index" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="profile/edit" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="shop/index" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="community/index" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="help" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="policies" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const [alexBrushLoaded] = useAlexBrush({
    AlexBrush_400Regular,
  });
  const [playfairLoaded] = usePlayfairDisplay({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
  });
  const [forceRender, setForceRender] = useState(false);

  const loaded = alexBrushLoaded && playfairLoaded;

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Force rendering app after timeout');
      setForceRender(true);
      SplashScreen.hideAsync();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!loaded && !forceRender) {
    return null;
  }

  return (
    <ErrorBoundary>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <UserContext>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <StatusBar style="light" />
              <RootLayoutNav />
            </GestureHandlerRootView>
          </UserContext>
            </AuthProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </ErrorBoundary>
  );
}
