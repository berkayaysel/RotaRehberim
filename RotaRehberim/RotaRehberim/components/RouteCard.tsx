import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Typography } from "@/constants/theme";
import { Route } from "@/types";
import { ThemedText } from "./ThemedText";
import { getAvatarSource } from "@/utils/avatars";

interface RouteCardProps {
  route: Route;
  onPress: () => void;
}

export default function RouteCard({ route, onPress }: RouteCardProps) {
  const { theme } = useTheme();

  const getCategoryIcon = () => {
    switch (route.category) {
      case "walking":
        return "user";
      case "driving":
        return "truck";
      case "mixed":
        return "shuffle";
      default:
        return "map-pin";
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: theme.surface, borderColor: theme.border },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <Image source={{ uri: route.photos[0] }} style={styles.thumbnail} />
      <View style={styles.content}>
        <ThemedText style={styles.title} numberOfLines={1}>
          {route.title}
        </ThemedText>
        <ThemedText style={[styles.description, { color: theme.textSecondary }]} numberOfLines={2}>
          {route.description}
        </ThemedText>
        <View style={styles.metadata}>
          <View style={styles.rating}>
            <Feather name="star" size={14} color="#FFC107" />
            <Text style={[styles.ratingText, { color: theme.text }]}>
              {route.rating.toFixed(1)} ({route.ratingCount})
            </Text>
          </View>
          <View style={styles.badge}>
            <Feather name="clock" size={14} color={theme.textSecondary} />
            <ThemedText style={[styles.badgeText, { color: theme.textSecondary }]}>
              {route.duration}
            </ThemedText>
          </View>
          <View style={styles.badge}>
            <Feather name={getCategoryIcon()} size={14} color={theme.textSecondary} />
          </View>
        </View>
        <View style={styles.creator}>
          <Image
            source={getAvatarSource(route.creatorAvatar)}
            style={styles.avatar}
          />
          <ThemedText style={[styles.creatorName, { color: theme.textSecondary }]}>
            {route.creatorName}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: Spacing.md,
  },
  pressed: {
    opacity: 0.7,
  },
  thumbnail: {
    width: 100,
    height: 120,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  title: {
    fontSize: Typography.h3.fontSize,
    fontWeight: Typography.h3.fontWeight,
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: Typography.small.fontSize,
    marginBottom: Spacing.sm,
  },
  metadata: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: Typography.caption.fontSize,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  badgeText: {
    fontSize: Typography.caption.fontSize,
  },
  creator: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  creatorName: {
    fontSize: Typography.caption.fontSize,
  },
});
