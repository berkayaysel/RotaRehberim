import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Image, Pressable } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { Spacing, Typography, BorderRadius } from "@/constants/theme";
import { ProfileStackParamList } from "@/navigation/ProfileStackNavigator";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { getAvatarSource } from "@/utils/avatars";
import { getCreatedRoutes, getFavorites, getRatings } from "@/services/storage";
import { MOCK_ROUTES } from "@/services/mockData";

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const insets = useScreenInsets();
  const { user } = useAuth();
  const [routesCount, setRoutesCount] = useState(user?.routesCreated || 0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      const fetchCounts = async () => {
        // Get routes count
        const routes = await getCreatedRoutes();
        setRoutesCount(routes.length);

        // Get favorites count
        const favorites = await getFavorites();
        setFavoritesCount(favorites.length);

        // Get reviews count - count all ratings given by this user
        let totalReviews = 0;
        const allRouteIds = new Set<string>();

        // Collect all mock route IDs
        MOCK_ROUTES.forEach((route) => allRouteIds.add(route.id));

        // Collect all created route IDs
        routes.forEach((route) => allRouteIds.add(route.id));

        // Count reviews from this user
        for (const routeId of allRouteIds) {
          const ratings = await getRatings(routeId);
          totalReviews += ratings.filter((r) => r.userId === user?.id).length;
        }

        setReviewsCount(totalReviews);
      };
      fetchCounts();
    }, [user?.id])
  );

  if (!user) return null;

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom }]}>
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Profile</ThemedText>
          <Pressable onPress={() => navigation.navigate("EditProfile" as any)}>
            <Feather name="edit-2" size={24} color={theme.primary} />
          </Pressable>
        </View>

        <View style={[styles.profileCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Image source={getAvatarSource(user.avatar, user.photoUri)} style={styles.avatar} />
          <ThemedText style={styles.name}>{user.name}</ThemedText>
          <ThemedText style={[styles.email, { color: theme.textSecondary }]}>{user.email}</ThemedText>
          <ThemedText style={[styles.memberSince, { color: theme.textTertiary }]}>
            Member since {new Date(user.memberSince).toLocaleDateString()}
          </ThemedText>
          {user.dateOfBirth && (
            <ThemedText style={[styles.memberSince, { color: theme.textTertiary }]}>
              Date of Birth: {new Date(user.dateOfBirth).toLocaleDateString()}
            </ThemedText>
          )}
          {user.gender && (
            <ThemedText style={[styles.memberSince, { color: theme.textTertiary }]}>
              Gender: {user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}
            </ThemedText>
          )}

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>{routesCount}</ThemedText>
              <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>Routes</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>{reviewsCount}</ThemedText>
              <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>Reviews</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>{favoritesCount}</ThemedText>
              <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>Favorites</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>My Routes</ThemedText>
          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              { backgroundColor: "#2B7A4B" },
              pressed && styles.pressed,
            ]}
            onPress={() => navigation.navigate("CreateRoute" as any)}
          >
            <Feather name="plus" size={20} color="#FFFFFF" />
            <ThemedText style={[styles.actionText, { color: "#FFFFFF" }]}>Create New Route</ThemedText>
            <Feather name="chevron-right" size={20} color="#FFFFFF" />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              { backgroundColor: theme.surface, borderColor: theme.border },
              pressed && styles.pressed,
            ]}
            onPress={() => navigation.navigate("MyRoutes")}
          >
            <Feather name="map" size={20} color={theme.primary} />
            <ThemedText style={styles.actionText}>View all my routes</ThemedText>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              { backgroundColor: theme.surface, borderColor: theme.border },
              pressed && styles.pressed,
            ]}
            onPress={() => navigation.navigate("FavoritesTab" as any)}
          >
            <Feather name="heart" size={20} color={theme.primary} />
            <ThemedText style={styles.actionText}>My Favorites</ThemedText>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              { backgroundColor: theme.surface, borderColor: theme.border },
              pressed && styles.pressed,
            ]}
            onPress={() => navigation.navigate("HelpSupport" as any)}
          >
            <Feather name="help-circle" size={20} color={theme.primary} />
            <ThemedText style={styles.actionText}>Help & Support</ThemedText>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              { backgroundColor: theme.surface, borderColor: theme.border },
              pressed && styles.pressed,
            ]}
            onPress={() => navigation.navigate("ClearRoutes" as any)}
          >
            <Feather name="trash-2" size={20} color={theme.primary} />
            <ThemedText style={styles.actionText}>Clear Created Routes</ThemedText>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </Pressable>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    fontSize: Typography.hero.fontSize,
    fontWeight: Typography.hero.fontWeight,
  },
  profileCard: {
    alignItems: "center",
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: Spacing.md,
  },
  name: {
    fontSize: Typography.h1.fontSize,
    fontWeight: Typography.h1.fontWeight,
    marginBottom: Spacing.xs,
  },
  email: {
    fontSize: Typography.body.fontSize,
    marginBottom: Spacing.xs,
  },
  memberSince: {
    fontSize: Typography.caption.fontSize,
    marginBottom: Spacing.lg,
  },
  stats: {
    flexDirection: "row",
    gap: Spacing.xl,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: Typography.h1.fontSize,
    fontWeight: Typography.h1.fontWeight,
  },
  statLabel: {
    fontSize: Typography.caption.fontSize,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.h2.fontSize,
    fontWeight: Typography.h2.fontWeight,
    marginBottom: Spacing.md,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  actionText: {
    flex: 1,
    fontSize: Typography.body.fontSize,
  },
  pressed: {
    opacity: 0.7,
  },
});
