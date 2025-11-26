import React, { useState, useMemo, useEffect } from "react";
import { View, StyleSheet, Pressable, SectionList } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Typography, BorderRadius } from "@/constants/theme";
import { ExploreStackParamList } from "@/navigation/ExploreStackNavigator";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import SearchBar from "@/components/SearchBar";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { getCountries, getCitiesByCountry, searchCities, getRoutesByCityId } from "@/services/mockData";
import { City } from "@/types";

type NavigationProp = NativeStackNavigationProp<ExploreStackParamList>;

export default function ExploreScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const insets = useScreenInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCountries, setExpandedCountries] = useState<Set<string>>(new Set());
  const [routeCounts, setRouteCounts] = useState<Record<string, number>>({});

  const countries = useMemo(() => getCountries(), []);

  useFocusEffect(
    React.useCallback(() => {
      const loadRouteCounts = async () => {
        const counts: Record<string, number> = {};
        for (const country of countries) {
          const cities = getCitiesByCountry(country);
          for (const city of cities) {
            const routes = await getRoutesByCityId(city.id);
            counts[city.id] = routes.length;
          }
        }
        setRouteCounts(counts);
      };
      loadRouteCounts();
    }, [countries])
  );

  const sections = useMemo(() => {
    if (searchQuery.trim()) {
      const results = searchCities(searchQuery);
      const groupedByCountry = results.reduce((acc, city) => {
        if (!acc[city.country]) {
          acc[city.country] = [];
        }
        acc[city.country].push(city);
        return acc;
      }, {} as Record<string, City[]>);

      return Object.entries(groupedByCountry).map(([country, cities]) => ({
        title: country,
        data: cities,
      }));
    }

    return countries.map((country) => ({
      title: country,
      data: expandedCountries.has(country) ? getCitiesByCountry(country) : [],
    }));
  }, [countries, expandedCountries, searchQuery]);

  const toggleCountry = (country: string) => {
    const newExpanded = new Set(expandedCountries);
    if (newExpanded.has(country)) {
      newExpanded.delete(country);
    } else {
      newExpanded.add(country);
    }
    setExpandedCountries(newExpanded);
  };

  const handleCityPress = (city: City) => {
    navigation.navigate("CityRoutes", {
      cityId: city.id,
      cityName: city.cityName,
      country: city.country,
    });
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <HeaderTitle title="RouteDiscover" />
      </View>
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search countries or cities"
        />
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.id + index}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom }]}
        renderSectionHeader={({ section }) => (
          <Pressable
            style={({ pressed }) => [
              styles.countryHeader,
              { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
              pressed && styles.pressed,
            ]}
            onPress={() => !searchQuery && toggleCountry(section.title)}
          >
            <View style={styles.countryHeaderContent}>
              <Feather name="globe" size={20} color={theme.primary} />
              <ThemedText style={styles.countryName}>{section.title}</ThemedText>
              <ThemedText style={[styles.cityCount, { color: theme.textSecondary }]}>
                {getCitiesByCountry(section.title).length} cities
              </ThemedText>
            </View>
            {!searchQuery && (
              <Feather
                name={expandedCountries.has(section.title) ? "chevron-up" : "chevron-down"}
                size={20}
                color={theme.textSecondary}
              />
            )}
          </Pressable>
        )}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.cityCard,
              { backgroundColor: theme.surface, borderColor: theme.border },
              pressed && styles.pressed,
            ]}
            onPress={() => handleCityPress(item)}
          >
            <View style={styles.cityContent}>
              <ThemedText style={styles.cityName}>{item.cityName}</ThemedText>
              <ThemedText style={[styles.routeCount, { color: theme.textSecondary }]}>
                {routeCounts[item.id] ?? item.routeCount} routes
              </ThemedText>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </Pressable>
        )}
      />
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
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
  countryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  countryHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  countryFlag: {
    fontSize: 24,
  },
  countryName: {
    fontSize: Typography.h3.fontSize,
    fontWeight: Typography.h3.fontWeight,
  },
  cityCount: {
    fontSize: Typography.caption.fontSize,
  },
  cityCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xl,
  },
  cityContent: {
    flex: 1,
  },
  cityName: {
    fontSize: Typography.body.fontSize,
    fontWeight: Typography.h3.fontWeight,
    marginBottom: 2,
  },
  routeCount: {
    fontSize: Typography.caption.fontSize,
  },
  pressed: {
    opacity: 0.7,
  },
});
