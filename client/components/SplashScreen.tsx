import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  FadeIn,
  FadeInUp,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Spacing, BorderRadius } from "@/constants/theme";

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

const FEATURES = [
  { icon: "grid" as const, text: "100-Number Grid Display" },
  { icon: "zap" as const, text: "Auto & Manual Modes" },
  { icon: "clock" as const, text: "Generation History" },
];

export default function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
  const insets = useSafeAreaInsets();
  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 600 });
    logoScale.value = withSequence(
      withSpring(1.1, { damping: 8, stiffness: 100 }),
      withSpring(1, { damping: 12, stiffness: 150 })
    );

    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  return (
    <LinearGradient
      colors={["#312E81", "#1E1B4B", "#0F0E24"]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + Spacing.xxl, paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.logo}
            contentFit="contain"
          />
        </Animated.View>

        <Animated.View entering={FadeIn.delay(400).duration(500)} style={styles.textContainer}>
          <ThemedText style={styles.appName}>Tambola Caller</ThemedText>
          <ThemedText style={styles.tagline}>
            Your Perfect Housie Companion
          </ThemedText>
        </Animated.View>

        <View style={styles.featuresContainer}>
          {FEATURES.map((feature, index) => (
            <Animated.View
              key={feature.text}
              entering={FadeInUp.delay(800 + index * 150).duration(400)}
              style={styles.featureRow}
            >
              <View style={styles.featureIcon}>
                <Feather name={feature.icon} size={18} color="#84CC16" />
              </View>
              <ThemedText style={styles.featureText}>{feature.text}</ThemedText>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      <Animated.View
        entering={FadeIn.delay(1500).duration(500)}
        style={[styles.footer, { bottom: insets.bottom + 20 }]}
      >
        <ThemedText style={styles.footerText}>
          Perfect for Tambola & Housie Games
        </ThemedText>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  logoContainer: {
    marginBottom: Spacing.lg,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.lg,
  },
  textContainer: {
    alignItems: "center",
  },
  appName: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  tagline: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  featuresContainer: {
    gap: Spacing.md,
    alignItems: "flex-start",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(132, 204, 22, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  footerText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
  },
});
