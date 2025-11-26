import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert, Pressable } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { Spacing, Typography } from "@/constants/theme";
import RouteCard from "@/components/RouteCard";
import { HeaderTitle } from "@/components/HeaderTitle";
import { getNearbyRoutes } from "@/services/locationService";
import { getAllRoutes } from "@/services/mockData";
import { Route } from "@/types";
import type { ExploreStackParamList } from "@/navigation/ExploreStackNavigator";

type NavigationProp = NativeStackNavigationProp<ExploreStackParamList, "CityRoutes">;

export default function NearbyRoutesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const insets = useScreenInsets();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [radius, setRadius] = useState(50);

  useFocusEffect(
    React.useCallback(() => {
      loadNearbyRoutes();
    }, [])
  );

  const loadNearbyRoutes = async () => {
    try {
      setLoading(true);
      const allRoutes = await getAllRoutes();
      const nearby = await getNearbyRoutes(allRoutes, radius);
      setRoutes(nearby);
    } catch (error) {
      console.error("Failed to load nearby routes:", error);
      Alert.alert("Error", "Could not load nearby routes");
    } finally {
      setLoading(false);
    }
  };

  const handleRoutePress = (routeId: string) => {
    navigation.navigate("RouteDetail", { routeId });
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <HeaderTitle title="Nearby Routes" />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom }]}>
        <View style={styles.radiusControl}>
          <Feather name="map-pin" size={20} color={theme.primary} />
          <ThemedText style={styles.radiusLabel}>
            Within {radius}km
          </ThemedText>
          <View style={styles.radiusButtons}>
            {[25, 50, 100].map((r) => (
              <Pressable
                key={r}
                style={[
                  styles.radiusButton,
                  {
                    backgroundColor: radius === r ? theme.primary : theme.surface,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => {
                  setRadius(r);
                  loadNearbyRoutes();
                }}
              >
                <ThemedText style={[styles.radiusButtonText, { color: radius === r ? "#FFFFFF" : theme.text }]}>
                  {r}km
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        {loading ? (
          <View style={styles.centerContainer}>
            <Feather name="map-pin" size={48} color={theme.textTertiary} />
            <ThemedText style={[styles.loadingText, { color: theme.textSecondary }]}>
              Finding nearby routes...
            </ThemedText>
          </View>
        ) : routes.length > 0 ? (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              {routes.length} Route{routes.length !== 1 ? "s" : ""} Found
            </ThemedText>
            {routes.map((route) => (
              <RouteCard
                key={route.id}
                route={route}
                onPress={() => handleRoutePress(route.id)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.centerContainer}>
            <Feather name="compass" size={48} color={theme.textTertiary} />
            <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
              No routes found within {radius}km
            </ThemedText>
            <ThemedText style={[styles.emptySubtext, { color: theme.textTertiary }]}>
              Try increasing the search radius
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  content: {
    paddingTop: Spacing.lg,
  },
  radiusControl: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  radiusLabel: {
    fontSize: Typography.h3.fontSize,
    fontWeight: Typography.h3.fontWeight,
    marginBottom: Spacing.md,
  },
  radiusButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  radiusButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  radiusButtonText: {
    fontWeight: "600",
  },
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["3xl"],
  },
  loadingText: {
    marginTop: Spacing.lg,
    fontSize: Typography.body.fontSize,
  },
  section: {
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.h2.fontSize,
    fontWeight: Typography.h2.fontWeight,
    marginBottom: Spacing.md,
  },
  emptyText: {
    marginTop: Spacing.lg,
    fontSize: Typography.body.fontSize,
    textAlign: "center",
  },
  emptySubtext: {
    marginTop: Spacing.sm,
    fontSize: Typography.body.fontSize,
    textAlign: "center",
  },
});
