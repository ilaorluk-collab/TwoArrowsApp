import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Slot } from 'expo-router';
import { useGameStore } from '@/store/gameStore';
import React, { useEffect, useState } from 'react';
import { useFonts, Lobster_400Regular } from '@expo-google-fonts/lobster';
import * as SplashScreen from 'expo-splash-screen';

// Предотвращаем автоматическое скрытие нативного сплэш-скрина
SplashScreen.preventAutoHideAsync().catch(() => {});

function RootLayoutInner() {
  const _hasHydrated = useGameStore((s) => s._hasHydrated);
  const [forceRender, setForceRender] = useState(false);
  const [fontsLoaded] = useFonts({ Lobster_400Regular });

  useEffect(() => {
    const timer = setTimeout(() => setForceRender(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const isReady = (_hasHydrated || forceRender) && fontsLoaded;

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isReady]);

  if (!isReady) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#d76a53" />
      </View>
    );
  }

  // Убрали GestureHandlerRootView, так как он может сжирать все клики на iOS
  return (
    <SafeAreaProvider style={styles.root}>
      <Slot />
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return <RootLayoutInner />;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
  },
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff5f0',
  },
});

