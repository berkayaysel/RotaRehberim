import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Text,
  useColorScheme,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Spacing, Typography, BorderRadius, Colors } from "@/constants/theme";

interface AddReviewModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  routeTitle: string;
}

export function AddReviewModal({
  visible,
  onClose,
  onSubmit,
  routeTitle,
}: AddReviewModalProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    if (comment.trim().length < 10) {
      setError("Review must be at least 10 characters");
      return;
    }
    onSubmit(rating, comment.trim());
    setRating(0);
    setComment("");
    setError("");
  };

  const handleClose = () => {
    setRating(0);
    setComment("");
    setError("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Write a Review</Text>
            <Pressable onPress={handleClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={theme.text} />
            </Pressable>
          </View>

          <Text style={[styles.routeTitle, { color: theme.textSecondary }]}>
            {routeTitle}
          </Text>

          <View style={styles.ratingSection}>
            <Text style={[styles.sectionLabel, { color: theme.text }]}>Your Rating</Text>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable key={star} onPress={() => setRating(star)}>
                  <Feather
                    name={star <= rating ? "star" : "star"}
                    size={32}
                    color={star <= rating ? "#FFC107" : theme.border}
                  />
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.commentSection}>
            <Text style={[styles.sectionLabel, { color: theme.text }]}>Your Review</Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.backgroundDefault,
                  borderColor: error ? "#F44336" : theme.border,
                  color: theme.text,
                },
              ]}
              placeholder="Share your experience on this route..."
              placeholderTextColor={theme.textTertiary}
              multiline
              numberOfLines={4}
              value={comment}
              onChangeText={(text) => {
                setComment(text);
                setError("");
              }}
              maxLength={500}
            />
            <Text style={[styles.charCount, { color: theme.textSecondary }]}>
              {comment.length}/500
            </Text>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.buttonContainer}>
            <Pressable
              style={[
                styles.button,
                styles.cancelButton,
                { borderColor: theme.border },
              ]}
              onPress={handleClose}
            >
              <Text style={[styles.buttonText, { color: theme.text }]}>
                Cancel
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.button,
                styles.submitButton,
                { backgroundColor: "#2B7A4B" },
              ]}
              onPress={handleSubmit}
            >
              <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>
                Submit Review
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.xl,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: Typography.h2.fontSize,
    fontWeight: Typography.h2.fontWeight,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  routeTitle: {
    fontSize: Typography.body.fontSize,
    marginBottom: Spacing.xl,
  },
  ratingSection: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontSize: Typography.body.fontSize,
    fontWeight: Typography.button.fontWeight,
    marginBottom: Spacing.sm,
  },
  stars: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  commentSection: {
    marginBottom: Spacing.md,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.body.fontSize,
    minHeight: 100,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: Typography.caption.fontSize,
    textAlign: "right",
    marginTop: Spacing.xs,
  },
  errorText: {
    color: "#F44336",
    fontSize: Typography.small.fontSize,
    marginBottom: Spacing.md,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    borderWidth: 2,
  },
  submitButton: {},
  buttonText: {
    fontSize: Typography.button.fontSize,
    fontWeight: Typography.button.fontWeight,
  },
});
