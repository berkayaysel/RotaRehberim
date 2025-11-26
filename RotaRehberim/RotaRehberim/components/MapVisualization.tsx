import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { ThemedText } from "./ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Typography } from "@/constants/theme";
import type { RouteStop } from "@/types";

interface MapVisualizationProps {
  stops: RouteStop[];
  width?: number;
  height?: number;
}

export function MapVisualization({ stops, width = 350, height = 220 }: MapVisualizationProps) {
  const { theme } = useTheme();

  if (stops.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundDefault, width, height }]}>
      {/* Route path visualization using text-based connectors */}
      <View style={styles.routePath}>
        {stops.map((stop, index) => (
          <View key={index} style={styles.stopContainer}>
            {/* Connector line (visual) */}
            {index < stops.length - 1 && (
              <View
                style={[
                  styles.connector,
                  {
                    backgroundColor: "#2B7A4B",
                  },
                ]}
              />
            )}
            
            {/* Stop marker with number */}
            <View
              style={[
                styles.stopMarker,
                {
                  backgroundColor: "#2B7A4B",
                },
              ]}
            >
              <ThemedText style={styles.stopNumber}>{index + 1}</ThemedText>
            </View>

            {/* Stop info */}
            <View style={styles.stopInfo}>
              <ThemedText style={styles.stopName} numberOfLines={1}>
                {stop.name}
              </ThemedText>
              {stop.description && (
                <ThemedText
                  style={[styles.stopDesc, { color: theme.textSecondary }]}
                  numberOfLines={1}
                >
                  {stop.description}
                </ThemedText>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: Spacing.md,
    overflow: "hidden",
  },
  routePath: {
    flexDirection: "column",
  },
  stopContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
    position: "relative",
  },
  connector: {
    position: "absolute",
    left: 19,
    top: 40,
    width: 2,
    height: 50,
    zIndex: 0,
  },
  stopMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
    zIndex: 1,
  },
  stopNumber: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  stopInfo: {
    flex: 1,
    paddingTop: Spacing.xs,
  },
  stopName: {
    fontSize: 14,
    fontWeight: "600",
  },
  stopDesc: {
    fontSize: 12,
    marginTop: Spacing.xs,
  },
});
