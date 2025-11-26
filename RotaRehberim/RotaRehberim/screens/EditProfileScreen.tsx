import React, { useState } from "react";
import { View, StyleSheet, Pressable, TextInput, ScrollView, Alert, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Spacing, Typography, BorderRadius } from "@/constants/theme";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { SuccessNotification } from "@/components/SuccessNotification";
import { getAvatarSource } from "@/utils/avatars";

type NavigationProp = NativeStackNavigationProp<any>;

export default function EditProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const insets = useScreenInsets();
  const { user, updateUser } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);

  const [username, setUsername] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [photoUri, setPhotoUri] = useState(user?.photoUri || "");

  if (!user) return null;

  const handlePickPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleSave = async () => {
    if (!username.trim()) {
      Alert.alert("Validation", "Username cannot be empty");
      return;
    }

    await updateUser({
      name: username,
      email,
      dateOfBirth,
      gender: gender as "male" | "female" | "other",
      photoUri: photoUri || undefined,
    });

    setShowSuccess(true);
    setTimeout(() => {
      navigation.goBack();
    }, 2000);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigation.goBack();
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
      {showSuccess && (
        <SuccessNotification
          message="Profile updated successfully!"
          onClose={handleSuccessClose}
        />
      )}

      <View style={[styles.header, { paddingTop: Spacing.lg, paddingHorizontal: Spacing.lg }]}>
        <Pressable onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={28} color={theme.text} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Edit Profile</ThemedText>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}>
        <View style={styles.section}>
          <ThemedText style={styles.label}>Profile Photo</ThemedText>
          <View style={[styles.photoContainer, { backgroundColor: theme.surface }]}>
            <Image 
              source={photoUri ? { uri: photoUri } : getAvatarSource(user.avatar, photoUri)} 
              style={styles.photoPreview} 
            />
            <Pressable
              style={[styles.photoButton, { backgroundColor: theme.primary }]}
              onPress={handlePickPhoto}
            >
              <Feather name="camera" size={20} color="#FFFFFF" />
              <ThemedText style={[styles.photoButtonText, { color: "#FFFFFF" }]}>
                Change Photo
              </ThemedText>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Username</ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.surface,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder="Enter your username"
            placeholderTextColor={theme.textTertiary}
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Email Address</ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.surface,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder="Enter your email"
            placeholderTextColor={theme.textTertiary}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Date of Birth (YYYY-MM-DD)</ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.surface,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder="e.g., 1990-05-15"
            placeholderTextColor={theme.textTertiary}
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Gender</ThemedText>
          <View style={styles.genderContainer}>
            {["male", "female", "other"].map((g) => (
              <Pressable
                key={g}
                style={[
                  styles.genderButton,
                  {
                    backgroundColor: gender === g ? theme.primary : theme.surface,
                    borderColor: gender === g ? theme.primary : theme.border,
                  },
                ]}
                onPress={() => setGender(g)}
              >
                <ThemedText
                  style={[
                    styles.genderButtonText,
                    { color: gender === g ? "#FFFFFF" : theme.text },
                  ]}
                >
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: theme.border, paddingBottom: insets.bottom + 20 }]}>
        <Pressable
          style={[
            styles.button,
            { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 },
          ]}
          onPress={() => navigation.goBack()}
        >
          <ThemedText style={[styles.buttonText, { color: theme.text }]}>Cancel</ThemedText>
        </Pressable>
        <Pressable
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleSave}
        >
          <ThemedText style={[styles.buttonText, { color: "#FFFFFF" }]}>Save Changes</ThemedText>
        </Pressable>
      </View>
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
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.h1.fontSize,
    fontWeight: Typography.h1.fontWeight,
  },
  content: {
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  photoContainer: {
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  photoPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xs,
    gap: Spacing.sm,
  },
  photoButtonText: {
    fontSize: Typography.body.fontSize,
    fontWeight: "600",
  },
  label: {
    fontSize: Typography.body.fontSize,
    fontWeight: "600",
    marginBottom: Spacing.md,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.body.fontSize,
  },
  genderContainer: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  genderButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    alignItems: "center",
  },
  genderButtonText: {
    fontSize: Typography.body.fontSize,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xs,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: Typography.body.fontSize,
    fontWeight: "600",
  },
});
