import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as ExpoSplashScreen from "expo-splash-screen";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";

import RootStackNavigator from "@/navigation/RootStackNavigator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { GameSessionProvider } from "@/hooks/useGameSession";
import SplashScreen from "@/components/SplashScreen";

ExpoSplashScreen.preventAutoHideAsync();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await ExpoSplashScreen.hideAsync();
      setAppReady(true);
    }
    prepare();
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (!appReady) {
    return null;
  }

  if (showSplash) {
    return (
      <GestureHandlerRootView style={styles.root}>
        <SplashScreen onAnimationComplete={handleSplashComplete} />
        <StatusBar style="light" />
      </GestureHandlerRootView>
    );
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <GestureHandlerRootView style={styles.root}>
            <KeyboardProvider>
              <GameSessionProvider>
                <NavigationContainer>
                  <RootStackNavigator />
                </NavigationContainer>
              </GameSessionProvider>
              <StatusBar style="auto" />
            </KeyboardProvider>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
