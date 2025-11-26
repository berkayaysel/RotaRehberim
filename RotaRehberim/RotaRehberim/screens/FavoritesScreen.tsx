import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Image } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Spacing, Typography } from "@/constants/theme";
import { FavoritesStackParamList } from "@/navigation/FavoritesStackNavigator";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import RouteCard from "@/components/RouteCard";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { getFavorites } from "@/services/storage";
import { getRouteById } from "@/services/mockData";
import { Route } from "@/types";
import { useTheme } from "@/hooks/useTheme";

type NavigationProp = NativeStackNavigationProp<FavoritesStackParamList>;

export default function FavoritesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const insets = useScreenInsets();
  const [favoriteRoutes, setFavoriteRoutes] = useState<Route[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    const favoriteIds = await getFavorites();
    const routes = favoriteIds
      .map((id) => getRouteById(id))
      .filter((route): route is Route => route !== undefined);
    setFavoriteRoutes(routes);
  };

  const handleRoutePress = (routeId: string) => {
    navigation.navigate("RouteDetail", { routeId });
  };

  return (
    <ThemedView style={styles.container}>
      {favoriteRoutes.length === 0 ? (
        <View style={styles.emptyState}>
          <Image
            source={require("../assets/images/empty-states/no-favorites.png")}
            style={styles.emptyImage}
          />
          <ThemedText style={styles.emptyTitle}>No favorites yet</ThemedText>
          <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
            Start exploring routes and save your favorites here
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={favoriteRoutes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RouteCard route={item} onPress={() => handleRoutePress(item.id)} />
          )}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom }]}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: Spacing.lg,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: Typography.h2.fontSize,
    fontWeight: Typography.h2.fontWeight,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.body.fontSize,
    textAlign: "center",
  },
});
