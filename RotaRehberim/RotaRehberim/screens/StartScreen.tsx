import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Typography, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function StartScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const handleStart = () => {
    navigation.replace("MainTabs");
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.logo}
            contentFit="contain"
          />
        </View>
        
        <View style={styles.textContainer}>
          <ThemedText style={styles.welcomeText}>Welcome to</ThemedText>
          <ThemedText style={styles.appName}>RouteDiscover</ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
            Discover amazing travel routes around the world
          </ThemedText>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.startButton,
            { backgroundColor: theme.primary },
            pressed && styles.pressed,
          ]}
          onPress={handleStart}
        >
          <ThemedText style={[styles.buttonText, { color: theme.buttonText }]}>
            Get Started
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: Spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: Spacing["3xl"],
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.lg,
  },
  textContainer: {
    alignItems: "center",
  },
  welcomeText: {
    fontSize: Typography.h2.fontSize,
    fontWeight: Typography.h2.fontWeight,
    marginBottom: Spacing.xs,
  },
  appName: {
    fontSize: 36,
    fontWeight: "700",
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: Typography.body.fontSize,
    textAlign: "center",
    paddingHorizontal: Spacing.xl,
  },
  buttonContainer: {
    paddingBottom: Spacing.xl,
  },
  startButton: {
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  buttonText: {
    fontSize: Typography.button.fontSize,
    fontWeight: Typography.button.fontWeight,
  },
  pressed: {
    opacity: 0.8,
  },
});
