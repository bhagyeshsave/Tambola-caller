import React, { useCallback, useState } from "react";
import { View, StyleSheet, Pressable, ScrollView, Modal } from "react-native";
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
  FadeIn,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { useGameSession } from "@/hooks/useGameSession";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface NumberBoxProps {
  number: number;
  isGenerated: boolean;
  isCurrentNumber: boolean;
}

function NumberBox({ number, isGenerated, isCurrentNumber }: NumberBoxProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.numberBox,
        {
          backgroundColor: isGenerated ? theme.accent : theme.backgroundSecondary,
          borderColor: isCurrentNumber ? theme.primary : "transparent",
          borderWidth: isCurrentNumber ? 3 : 0,
        },
      ]}
    >
      <ThemedText
        style={[
          styles.numberBoxText,
          {
            color: isGenerated ? "#FFFFFF" : theme.textSecondary,
            fontWeight: isGenerated ? "700" : "500",
          },
        ]}
      >
        {number}
      </ThemedText>
    </View>
  );
}

export default function GeneratorScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const {
    currentNumber,
    generatedNumbers,
    isSessionComplete,
    isPaused,
    generateNumber,
    clearSession,
    togglePause,
  } = useGameSession();

  const [showRestartModal, setShowRestartModal] = useState(false);

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
    if (isSessionComplete || isPaused) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    opacity.value = withTiming(0, { duration: 100 }, () => {
      runOnJS(generateNumber)();
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSequence(
        withSpring(1.15, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 12, stiffness: 150 })
      );
    });
  }, [generateNumber, isSessionComplete, isPaused, opacity, scale]);

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.96, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const handleRestart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowRestartModal(true);
  };

  const handleConfirmRestart = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    clearSession();
    setShowRestartModal(false);
  };

  const handleTogglePause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    togglePause();
  };

  const remainingCount = 100 - generatedNumbers.length;
  const allNumbers = Array.from({ length: 100 }, (_, i) => i + 1);

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + Spacing.sm,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <Pressable
            onPress={handleRestart}
            hitSlop={12}
            style={styles.headerIconButton}
            testID="button-restart"
          >
            <Feather name="refresh-cw" size={22} color={theme.textSecondary} />
          </Pressable>
        </View>

        <ThemedText style={[styles.headerTitle, { color: theme.text }]}>
          Lucky Draw
        </ThemedText>

        <View style={styles.headerRight}>
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
      </View>

      <View style={styles.currentNumberSection}>
        <Animated.View style={animatedNumberStyle}>
          <ThemedText
            style={[
              styles.currentNumber,
              { color: theme.primary },
              isSessionComplete && { color: theme.error },
            ]}
          >
            {currentNumber !== null ? currentNumber : "—"}
          </ThemedText>
        </Animated.View>

        {isPaused ? (
          <Animated.View entering={FadeIn}>
            <ThemedText style={[styles.statusText, { color: theme.textSecondary }]}>
              Session Paused
            </ThemedText>
          </Animated.View>
        ) : isSessionComplete ? (
          <ThemedText style={[styles.statusText, { color: theme.error }]}>
            All 100 numbers generated!
          </ThemedText>
        ) : currentNumber === null ? (
          <ThemedText style={[styles.statusText, { color: theme.textSecondary }]}>
            Tap Generate to start
          </ThemedText>
        ) : null}
      </View>

      <ScrollView
        style={styles.gridScrollView}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {allNumbers.map((num) => (
            <NumberBox
              key={num}
              number={num}
              isGenerated={generatedNumbers.includes(num)}
              isCurrentNumber={currentNumber === num}
            />
          ))}
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomSection,
          { paddingBottom: insets.bottom + Spacing.lg },
        ]}
      >
        <ThemedText style={[styles.sessionInfo, { color: theme.textSecondary }]}>
          {generatedNumbers.length} of 100 generated • {remainingCount} remaining
        </ThemedText>

        <View style={styles.buttonRow}>
          <Pressable
            onPress={handleTogglePause}
            style={[
              styles.secondaryButton,
              { backgroundColor: theme.backgroundSecondary },
            ]}
            testID="button-pause"
          >
            <Feather
              name={isPaused ? "play" : "pause"}
              size={20}
              color={theme.text}
            />
          </Pressable>

          <Animated.View style={[styles.generateButtonWrapper, animatedButtonStyle]}>
            <Pressable
              onPress={handleGenerate}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              disabled={isSessionComplete || isPaused}
              style={[
                styles.generateButton,
                { backgroundColor: theme.accent },
                (isSessionComplete || isPaused) && { opacity: 0.5 },
              ]}
              testID="button-generate"
            >
              <ThemedText style={styles.generateButtonText}>
                Generate
              </ThemedText>
            </Pressable>
          </Animated.View>

          <Pressable
            onPress={handleRestart}
            style={[
              styles.secondaryButton,
              { backgroundColor: theme.backgroundSecondary },
            ]}
            testID="button-restart-small"
          >
            <Feather name="refresh-cw" size={20} color={theme.text} />
          </Pressable>
        </View>
      </View>

      <Modal
        visible={showRestartModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRestartModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundDefault }]}>
            <ThemedText style={styles.modalTitle}>Restart Session?</ThemedText>
            <ThemedText style={[styles.modalMessage, { color: theme.textSecondary }]}>
              This will reset all generated numbers and start a new game session.
            </ThemedText>
            <View style={styles.modalButtons}>
              <Pressable
                onPress={() => setShowRestartModal(false)}
                style={[styles.modalButton, { backgroundColor: theme.backgroundSecondary }]}
                testID="button-cancel-restart"
              >
                <ThemedText style={styles.modalButtonText}>Cancel</ThemedText>
              </Pressable>
              <Pressable
                onPress={handleConfirmRestart}
                style={[styles.modalButton, { backgroundColor: theme.error }]}
                testID="button-confirm-restart"
              >
                <ThemedText style={[styles.modalButtonText, { color: "#FFFFFF" }]}>
                  Restart
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    height: 56,
  },
  headerLeft: {
    width: 80,
    alignItems: "flex-start",
  },
  headerRight: {
    width: 80,
    alignItems: "flex-end",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  headerIconButton: {
    padding: Spacing.xs,
  },
  headerButton: {
    fontSize: 17,
    fontWeight: "600",
  },
  currentNumberSection: {
    alignItems: "center",
    paddingVertical: Spacing.lg,
  },
  currentNumber: {
    fontSize: 80,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 90,
  },
  statusText: {
    fontSize: 14,
    marginTop: Spacing.xs,
  },
  gridScrollView: {
    flex: 1,
  },
  gridContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 4,
  },
  numberBox: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  numberBoxText: {
    fontSize: 11,
  },
  bottomSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  sessionInfo: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  secondaryButton: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  generateButtonWrapper: {
    flex: 1,
  },
  generateButton: {
    height: 52,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  modalContent: {
    width: "100%",
    maxWidth: 320,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  modalMessage: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
