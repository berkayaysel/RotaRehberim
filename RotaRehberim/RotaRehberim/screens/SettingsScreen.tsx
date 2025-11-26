import React from "react";
import { View, StyleSheet, ScrollView, Pressable, Alert, Switch } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Spacing, Typography, BorderRadius } from "@/constants/theme";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { useThemeContext } from "@/contexts/ThemeContext";

export default function SettingsScreen() {
  const { theme, isDark } = useTheme();
  const { isDark: themeDark, toggleTheme } = useThemeContext();
  const insets = useScreenInsets();
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={[styles.header, { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md }]}>
        <ThemedText style={styles.headerTitle}>Settings</ThemedText>
        <View style={[styles.themeToggle, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Feather name={themeDark ? "moon" : "sun"} size={20} color={theme.primary} />
          <Switch
            value={themeDark}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.textTertiary, true: theme.primary }}
            thumbColor={themeDark ? theme.primary : theme.textSecondary}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom }]}>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Preferences</ThemedText>
          <Pressable
            style={({ pressed }) => [
              styles.settingCard,
              { backgroundColor: theme.surface, borderColor: theme.border },
              pressed && styles.pressed,
            ]}
          >
            <Feather name="bell" size={20} color={theme.text} />
            <ThemedText style={styles.settingText}>Notifications</ThemedText>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.settingCard,
              { backgroundColor: theme.surface, borderColor: theme.border },
              pressed && styles.pressed,
            ]}
          >
            <Feather name="map" size={20} color={theme.text} />
            <ThemedText style={styles.settingText}>Map Style</ThemedText>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.settingCard,
              { backgroundColor: theme.surface, borderColor: theme.border },
              pressed && styles.pressed,
            ]}
          >
            <Feather name="globe" size={20} color={theme.text} />
            <ThemedText style={styles.settingText}>Units</ThemedText>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>About</ThemedText>
          <Pressable
            style={({ pressed }) => [
              styles.settingCard,
              { backgroundColor: theme.surface, borderColor: theme.border },
              pressed && styles.pressed,
            ]}
          >
            <Feather name="file-text" size={20} color={theme.text} />
            <ThemedText style={styles.settingText}>Privacy Policy</ThemedText>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.settingCard,
              { backgroundColor: theme.surface, borderColor: theme.border },
              pressed && styles.pressed,
            ]}
          >
            <Feather name="file-text" size={20} color={theme.text} />
            <ThemedText style={styles.settingText}>Terms of Service</ThemedText>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Account</ThemedText>
          <Pressable
            style={({ pressed }) => [
              styles.settingCard,
              { backgroundColor: theme.surface, borderColor: theme.border },
              pressed && styles.pressed,
            ]}
            onPress={handleLogout}
          >
            <Feather name="log-out" size={20} color={theme.error} />
            <ThemedText style={[styles.settingText, { color: theme.error }]}>Logout</ThemedText>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: Typography.hero.fontSize,
    fontWeight: Typography.hero.fontWeight,
  },
  themeToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.h2.fontSize,
    fontWeight: Typography.h2.fontWeight,
    marginBottom: Spacing.md,
  },
  settingCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  settingText: {
    flex: 1,
    fontSize: Typography.body.fontSize,
  },
  pressed: {
    opacity: 0.7,
  },
});
