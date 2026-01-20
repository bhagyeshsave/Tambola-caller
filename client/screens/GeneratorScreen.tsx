import React, { useState, useCallback } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { useGameSession } from "@/hooks/useGameSession";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function GeneratorScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const { currentNumber, generatedNumbers, generateNumber, isSessionComplete } = useGameSession();

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const buttonScale = useSharedValue(1);

  const animatedNumberStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleGenerate = useCallback(() => {
    if (isSessionComplete) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    opacity.value = withTiming(0, { duration: 100 }, () => {
      runOnJS(generateNumber)();
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSequence(
        withSpring(1.15, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 12, stiffness: 150 })
      );
    });
  }, [generateNumber, isSessionComplete, opacity, scale]);

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.96, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const remainingCount = 100 - generatedNumbers.length;

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.navigate("History")}
            hitSlop={12}
            testID="button-history"
          >
            <ThemedText style={[styles.headerButton, { color: theme.primary }]}>
              History
            </ThemedText>
          </Pressable>
        </View>

        <View style={styles.numberContainer}>
          <Animated.View style={animatedNumberStyle}>
            <ThemedText
              style={[
                styles.number,
                { color: theme.primary },
                isSessionComplete && { color: theme.error },
              ]}
            >
              {currentNumber !== null ? currentNumber : "—"}
            </ThemedText>
          </Animated.View>

          {currentNumber === null && !isSessionComplete ? (
            <ThemedText style={[styles.helperText, { color: theme.textSecondary }]}>
              Tap to generate your first number
            </ThemedText>
          ) : null}

          {isSessionComplete ? (
            <ThemedText style={[styles.helperText, { color: theme.error }]}>
              All 100 numbers have been generated!
            </ThemedText>
          ) : null}
        </View>

        <View style={styles.bottomSection}>
          <Animated.View style={animatedButtonStyle}>
            <Pressable
              onPress={handleGenerate}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              disabled={isSessionComplete}
              style={[
                styles.generateButton,
                { backgroundColor: theme.accent },
                isSessionComplete && { opacity: 0.5 },
              ]}
              testID="button-generate"
            >
              <ThemedText style={styles.generateButtonText}>
                Generate
              </ThemedText>
            </Pressable>
          </Animated.View>

          <ThemedText style={[styles.sessionInfo, { color: theme.textSecondary }]}>
            {generatedNumbers.length} of 100 generated • {remainingCount} remaining
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    height: 44,
  },
  headerButton: {
    fontSize: 17,
    fontWeight: "600",
  },
  numberContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  number: {
    fontSize: 120,
    fontWeight: "700",
    textAlign: "center",
  },
  helperText: {
    fontSize: 16,
    marginTop: Spacing.lg,
    textAlign: "center",
  },
  bottomSection: {
    paddingBottom: Spacing["2xl"],
  },
  generateButton: {
    height: 56,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  generateButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  sessionInfo: {
    fontSize: 14,
    textAlign: "center",
    marginTop: Spacing.lg,
  },
});
