import React, { useState } from "react";
import { View, StyleSheet, FlatList, Pressable, Modal, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { useGameSession } from "@/hooks/useGameSession";

interface HistoryItemProps {
  number: number;
  order: number;
  index: number;
}

function HistoryItem({ number, order, index }: HistoryItemProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 30).duration(300)}
      style={animatedStyle}
    >
      <View
        style={[
          styles.historyItem,
          { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
        ]}
      >
        <ThemedText style={[styles.historyNumber, { color: theme.primary }]}>
          {number}
        </ThemedText>
        <View style={[styles.orderBadge, { backgroundColor: theme.backgroundSecondary }]}>
          <ThemedText style={[styles.orderText, { color: theme.textSecondary }]}>
            #{order}
          </ThemedText>
        </View>
      </View>
    </Animated.View>
  );
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { generatedNumbers, clearSession } = useGameSession();
  const [showClearModal, setShowClearModal] = useState(false);

  const handleClearPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowClearModal(true);
  };

  const handleConfirmClear = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    clearSession();
    setShowClearModal(false);
  };

  const handleCancelClear = () => {
    setShowClearModal(false);
  };

  const reversedNumbers = [...generatedNumbers].reverse();

  const renderItem = ({ item, index }: { item: number; index: number }) => (
    <HistoryItem
      number={item}
      order={generatedNumbers.length - index}
      index={index}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={require("../../assets/images/empty-history.png")}
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
        No numbers generated yet
      </ThemedText>
      <ThemedText style={[styles.emptySubtext, { color: theme.textSecondary }]}>
        Start generating to see your history here
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={reversedNumbers}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item}-${index}`}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: headerHeight + Spacing.lg,
            paddingBottom: insets.bottom + Spacing.xl,
          },
          reversedNumbers.length === 0 && styles.emptyListContent,
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={true}
        testID="list-history"
      />

      <Modal
        visible={showClearModal}
        transparent
        animationType="fade"
        onRequestClose={handleCancelClear}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundDefault }]}>
            <ThemedText style={styles.modalTitle}>Clear Session?</ThemedText>
            <ThemedText style={[styles.modalMessage, { color: theme.textSecondary }]}>
              This will reset all generated numbers and start a new session.
            </ThemedText>
            <View style={styles.modalButtons}>
              <Pressable
                onPress={handleCancelClear}
                style={[styles.modalButton, { backgroundColor: theme.backgroundSecondary }]}
                testID="button-cancel-clear"
              >
                <ThemedText style={styles.modalButtonText}>Cancel</ThemedText>
              </Pressable>
              <Pressable
                onPress={handleConfirmClear}
                style={[styles.modalButton, { backgroundColor: theme.error }]}
                testID="button-confirm-clear"
              >
                <ThemedText style={[styles.modalButtonText, { color: "#FFFFFF" }]}>
                  Clear
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

export function HistoryClearButton() {
  const { theme } = useTheme();
  const { generatedNumbers, clearSession } = useGameSession();
  const [showClearModal, setShowClearModal] = useState(false);

  const handleClearPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowClearModal(true);
  };

  const handleConfirmClear = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    clearSession();
    setShowClearModal(false);
  };

  if (generatedNumbers.length === 0) return null;

  return (
    <>
      <Pressable onPress={handleClearPress} hitSlop={12} testID="button-clear">
        <ThemedText style={{ color: theme.error, fontSize: 17, fontWeight: "600" }}>
          Clear
        </ThemedText>
      </Pressable>

      <Modal
        visible={showClearModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowClearModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundDefault }]}>
            <ThemedText style={styles.modalTitle}>Clear Session?</ThemedText>
            <ThemedText style={[styles.modalMessage, { color: theme.textSecondary }]}>
              This will reset all generated numbers and start a new session.
            </ThemedText>
            <View style={styles.modalButtons}>
              <Pressable
                onPress={() => setShowClearModal(false)}
                style={[styles.modalButton, { backgroundColor: theme.backgroundSecondary }]}
              >
                <ThemedText style={styles.modalButtonText}>Cancel</ThemedText>
              </Pressable>
              <Pressable
                onPress={handleConfirmClear}
                style={[styles.modalButton, { backgroundColor: theme.error }]}
              >
                <ThemedText style={[styles.modalButtonText, { color: "#FFFFFF" }]}>
                  Clear
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: "center",
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: "visible",
  },
  historyNumber: {
    fontSize: 32,
    fontWeight: "700",
    minWidth: 80,
    paddingLeft: Spacing.sm,
  },
  orderBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  orderText: {
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  emptyImage: {
    width: 160,
    height: 160,
    marginBottom: Spacing.xl,
    opacity: 0.8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
    marginTop: Spacing.sm,
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
