import React from "react";
import { View, StyleSheet, Pressable, Switch } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { useGameSession } from "@/hooks/useGameSession";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { isAutoMode, autoSpeed, setAutoMode, setAutoSpeed } = useGameSession();

  const handleToggleAutoMode = (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAutoMode(value);
  };

  const handleSpeedChange = (value: number) => {
    setAutoSpeed(Math.round(value));
  };

  const handleSpeedChangeComplete = (value: number) => {
    Haptics.selectionAsync();
    setAutoSpeed(Math.round(value));
  };

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.content,
          {
            paddingTop: headerHeight + Spacing.lg,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
      >
        <View style={[styles.section, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <View style={[styles.settingIcon, { backgroundColor: theme.accent }]}>
                <Feather name="zap" size={18} color="#FFFFFF" />
              </View>
              <View style={styles.settingText}>
                <ThemedText style={styles.settingTitle}>Auto Generation</ThemedText>
                <ThemedText style={[styles.settingDescription, { color: theme.textSecondary }]}>
                  Automatically generate numbers at set intervals
                </ThemedText>
              </View>
            </View>
            <Switch
              value={isAutoMode}
              onValueChange={handleToggleAutoMode}
              trackColor={{ false: theme.backgroundTertiary, true: theme.accent }}
              thumbColor="#FFFFFF"
              testID="switch-auto-mode"
            />
          </View>
        </View>

        {isAutoMode ? (
          <View style={[styles.section, { backgroundColor: theme.backgroundDefault }]}>
            <View style={styles.speedSection}>
              <View style={styles.speedHeader}>
                <View style={styles.settingInfo}>
                  <View style={[styles.settingIcon, { backgroundColor: theme.primary }]}>
                    <Feather name="clock" size={18} color="#FFFFFF" />
                  </View>
                  <View style={styles.settingText}>
                    <ThemedText style={styles.settingTitle}>Generation Speed</ThemedText>
                    <ThemedText style={[styles.settingDescription, { color: theme.textSecondary }]}>
                      Time between each number generation
                    </ThemedText>
                  </View>
                </View>
                <View style={[styles.speedBadge, { backgroundColor: theme.backgroundSecondary }]}>
                  <ThemedText style={[styles.speedBadgeText, { color: theme.primary }]}>
                    {autoSpeed}s
                  </ThemedText>
                </View>
              </View>

              <View style={styles.sliderContainer}>
                <ThemedText style={[styles.sliderLabel, { color: theme.textSecondary }]}>
                  1s
                </ThemedText>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                  value={autoSpeed}
                  onValueChange={handleSpeedChange}
                  onSlidingComplete={handleSpeedChangeComplete}
                  minimumTrackTintColor={theme.accent}
                  maximumTrackTintColor={theme.backgroundTertiary}
                  thumbTintColor={theme.accent}
                  testID="slider-speed"
                />
                <ThemedText style={[styles.sliderLabel, { color: theme.textSecondary }]}>
                  10s
                </ThemedText>
              </View>

              <View style={styles.speedPresets}>
                {[1, 2, 3, 5, 10].map((speed) => (
                  <Pressable
                    key={speed}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setAutoSpeed(speed);
                    }}
                    style={[
                      styles.presetButton,
                      {
                        backgroundColor:
                          autoSpeed === speed ? theme.accent : theme.backgroundSecondary,
                      },
                    ]}
                    testID={`button-speed-${speed}`}
                  >
                    <ThemedText
                      style={[
                        styles.presetButtonText,
                        { color: autoSpeed === speed ? "#FFFFFF" : theme.text },
                      ]}
                    >
                      {speed}s
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        ) : null}

        <View style={styles.infoSection}>
          <Feather name="info" size={16} color={theme.textSecondary} />
          <ThemedText style={[styles.infoText, { color: theme.textSecondary }]}>
            {isAutoMode
              ? "In auto mode, numbers will be generated automatically. Use the pause button to control playback."
              : "In manual mode, tap the Generate button to pick each number."}
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
    paddingHorizontal: Spacing.lg,
  },
  section: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  settingText: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  speedSection: {
    gap: Spacing.lg,
  },
  speedHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  speedBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  speedBadgeText: {
    fontSize: 16,
    fontWeight: "700",
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderLabel: {
    fontSize: 12,
    fontWeight: "500",
    width: 28,
    textAlign: "center",
  },
  speedPresets: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  presetButton: {
    flex: 1,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  presetButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  infoSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
});
