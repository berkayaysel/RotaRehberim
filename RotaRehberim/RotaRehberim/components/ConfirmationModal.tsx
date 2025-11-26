import React from "react";
import { View, StyleSheet, Pressable, Modal } from "react-native";
import { Spacing, Typography, BorderRadius } from "@/constants/theme";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  cancelText?: string;
  confirmText?: string;
  isDestructive?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmationModal({
  visible,
  title,
  message,
  cancelText = "Cancel",
  confirmText = "Confirm",
  isDestructive = false,
  onCancel,
  onConfirm,
}: ConfirmationModalProps) {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modal,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText
            style={[styles.message, { color: theme.textSecondary }]}
          >
            {message}
          </ThemedText>

          <View style={styles.buttonContainer}>
            <Pressable
              style={[
                styles.button,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  borderWidth: 1,
                },
              ]}
              onPress={onCancel}
            >
              <ThemedText style={[styles.buttonText, { color: theme.text }]}>
                {cancelText}
              </ThemedText>
            </Pressable>

            <Pressable
              style={[
                styles.button,
                {
                  backgroundColor: isDestructive ? "#F44336" : theme.primary,
                },
              ]}
              onPress={onConfirm}
            >
              <ThemedText style={[styles.buttonText, { color: "#FFFFFF" }]}>
                {confirmText}
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.lg,
    width: "80%",
    maxWidth: 400,
  },
  title: {
    fontSize: Typography.h2.fontSize,
    fontWeight: Typography.h2.fontWeight,
    marginBottom: Spacing.md,
  },
  message: {
    fontSize: Typography.body.fontSize,
    marginBottom: Spacing.xl,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xs,
    alignItems: "center",
  },
  buttonText: {
    fontSize: Typography.body.fontSize,
    fontWeight: "600",
  },
});
