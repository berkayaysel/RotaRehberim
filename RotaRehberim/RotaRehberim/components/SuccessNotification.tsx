import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "./ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";

interface SuccessNotificationProps {
  message: string;
  onClose: () => void;
}

export function SuccessNotification({ message, onClose }: SuccessNotificationProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: "#4CAF50" }]}>
      <ThemedText style={styles.message}>{message}</ThemedText>
      <Pressable onPress={onClose} style={styles.closeButton}>
        <Feather name="x" size={24} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: 8,
  },
  message: {
    flex: 1,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  closeButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.md,
  },
});
