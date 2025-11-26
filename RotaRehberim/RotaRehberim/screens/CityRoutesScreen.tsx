import React, { useState, useEffect, useMemo } from "react";
import { View, StyleSheet, ScrollView, Image, Pressable } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { Spacing, Typography, BorderRadius } from "@/constants/theme";
import { ExploreStackParamList } from "@/navigation/ExploreStackNavigator";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import RouteCard from "@/components/RouteCard";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { getRoutesByCityId, getRecommendedRoutes, getCityById } from "@/services/mockData";
import { useTheme } from "@/hooks/useTheme";
import { Route } from "@/types";

type ScreenRouteProp = RouteProp<ExploreStackParamList, "CityRoutes">;
type NavigationProp = NativeStackNavigationProp<ExploreStackParamList>;

export default function CityRoutesScreen() {
  const route = useRoute<ScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const insets = useScreenInsets();
  const { cityId, cityName, country } = route.params;

  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [durationFilter, setDurationFilter] = useState<"all" | "short" | "medium" | "long">("all");

  const city = getCityById(cityId);
  const recommendedRoutes = getRecommendedRoutes(3).filter((r) => r.cityId === cityId);

  useEffect(() => {
    loadRoutes();
  }, [cityId]);

  const loadRoutes = async () => {
    try {
      setLoading(true);
      const cityRoutes = await getRoutesByCityId(cityId);
      setRoutes(cityRoutes);
    } catch (error) {
      console.error("Failed to load routes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoutePress = (routeId: string) => {
    navigation.navigate("RouteDetail", { routeId });
  };

  const filteredRoutes = useMemo(() => {
    return routes.filter((r) => {
      if (selectedCategory && r.category !== selectedCategory) return false;
      if (durationFilter !== "all") {
        const mins = parseInt(r.duration);
        if (durationFilter === "short" && mins > 120) return false;
        if (durationFilter === "medium" && (mins < 120 || mins > 240)) return false;
        if (durationFilter === "long" && mins < 240) return false;
      }
      return true;
    });
  }, [routes, selectedCategory, durationFilter]);

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: Spacing.md, paddingBottom: Spacing.md, paddingHorizontal: Spacing.lg }]}>
        <ThemedText style={styles.headerTitle}>{cityName}</ThemedText>
      </View>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom }]}>
        {city?.thumbnail && (
          <View style={styles.hero}>
            <Image source={{ uri: city.thumbnail }} style={styles.heroImage} />
            <View style={styles.heroOverlay}>
              <ThemedText style={styles.heroTitle}>{cityName}</ThemedText>
              <ThemedText style={styles.heroSubtitle}>{country}</ThemedText>
            </View>
          </View>
        )}

        {recommendedRoutes.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Recommended Routes</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {recommendedRoutes.map((route) => (
                <View key={route.id} style={styles.horizontalCard}>
                  <RouteCard route={route} onPress={() => handleRoutePress(route.id)} />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.filterSection}>
          <ThemedText style={styles.filterLabel}>Filter by Category</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {["walking", "driving", "mixed"].map((cat) => (
              <Pressable
                key={cat}
                style={[
                  styles.filterButton,
                  { backgroundColor: selectedCategory === cat ? "#2B7A4B" : theme.surface, borderColor: theme.border },
                ]}
                onPress={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              >
                <ThemedText style={[styles.filterButtonText, { color: selectedCategory === cat ? "#FFFFFF" : theme.text }]}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>

          <ThemedText style={[styles.filterLabel, { marginTop: Spacing.md }]}>Filter by Duration</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {[
              { value: "all", label: "All" },
              { value: "short", label: "< 2 hrs" },
              { value: "medium", label: "2-4 hrs" },
              { value: "long", label: "> 4 hrs" },
            ].map((dur) => (
              <Pressable
                key={dur.value}
                style={[
                  styles.filterButton,
                  { backgroundColor: durationFilter === dur.value ? "#2B7A4B" : theme.surface, borderColor: theme.border },
                ]}
                onPress={() => setDurationFilter(dur.value as any)}
              >
                <ThemedText style={[styles.filterButtonText, { color: durationFilter === dur.value ? "#FFFFFF" : theme.text }]}>
                  {dur.label}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Routes ({filteredRoutes.length})</ThemedText>
          {filteredRoutes.length > 0 ? (
            filteredRoutes.map((route) => (
              <RouteCard key={route.id} route={route} onPress={() => handleRoutePress(route.id)} />
            ))
          ) : (
            <ThemedText style={[styles.noResults, { color: theme.textSecondary }]}>
              No routes match your filters
            </ThemedText>
          )}
        </View>

        {routes.length === 0 && (
          <View style={styles.emptyState}>
            <Image
              source={require("../assets/images/empty-states/no-routes.png")}
              style={styles.emptyImage}
            />
            <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
              No routes available in this city yet
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
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: Typography.h2.fontSize,
    fontWeight: Typography.h2.fontWeight,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: Typography.body.fontSize,
  },
  content: {
    paddingTop: Spacing.lg,
  },
  hero: {
    height: 200,
    marginBottom: Spacing.xl,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  heroTitle: {
    fontSize: Typography.hero.fontSize,
    fontWeight: Typography.hero.fontWeight,
    color: "#FFFFFF",
  },
  heroSubtitle: {
    fontSize: Typography.h3.fontSize,
    color: "#FFFFFF",
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.h2.fontSize,
    fontWeight: Typography.h2.fontWeight,
    marginBottom: Spacing.md,
  },
  horizontalScroll: {
    marginHorizontal: -Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  horizontalCard: {
    width: 300,
    marginRight: Spacing.md,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["3xl"],
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: Spacing.lg,
  },
  emptyText: {
    fontSize: Typography.body.fontSize,
    textAlign: "center",
  },
  filterSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  filterLabel: {
    fontSize: Typography.body.fontSize,
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  filterScroll: {
    marginHorizontal: -Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  filterButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    marginRight: Spacing.sm,
  },
  filterButtonText: {
    fontSize: Typography.body.fontSize,
    fontWeight: "500",
  },
  noResults: {
    fontSize: Typography.body.fontSize,
    textAlign: "center",
    marginTop: Spacing.lg,
  },
});
