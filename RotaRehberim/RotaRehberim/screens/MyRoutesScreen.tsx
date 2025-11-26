import React, { useState, useMemo } from "react";
import { View, StyleSheet, FlatList, Image, Pressable } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { Spacing, Typography, BorderRadius } from "@/constants/theme";
import { ProfileStackParamList } from "@/navigation/ProfileStackNavigator";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { SuccessNotification } from "@/components/SuccessNotification";
import RouteCard from "@/components/RouteCard";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { getCreatedRoutes, deleteCreatedRoute } from "@/services/storage";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { Route } from "@/types";

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

export default function MyRoutesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const insets = useScreenInsets();
  const { user } = useAuth();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const loadRoutes = async () => {
        const createdRoutes = await getCreatedRoutes();
        setRoutes(createdRoutes);
      };
      loadRoutes();
    }, [])
  );

  const myRoutes = useMemo(
    () => routes,
    [routes]
  );

  const handleRoutePress = (routeId: string) => {
    if (!isEditMode) {
      navigation.navigate("RouteDetail", { routeId });
    }
  };

  const handleDeleteRoute = (routeId: string) => {
    setPendingDeleteId(routeId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    
    try {
      setShowDeleteModal(false);
      await deleteCreatedRoute(pendingDeleteId);
      
      // Reload routes fresh from storage
      const updatedRoutes = await getCreatedRoutes();
      setRoutes(updatedRoutes);
      setPendingDeleteId(null);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleEditRoute = (routeId: string) => {
    // Navigate to edit route screen
    navigation.navigate("CreateRoute", { editRouteId: routeId });
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header with Edit Button */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <ThemedText style={styles.headerTitle}>My Routes</ThemedText>
        {myRoutes.length > 0 && (
          <Pressable
            style={[
              styles.editButton,
              {
                backgroundColor: isEditMode ? theme.primary : theme.surface,
                borderColor: theme.border,
              },
            ]}
            onPress={() => setIsEditMode(!isEditMode)}
          >
            <Feather
              name={isEditMode ? "check" : "edit-2"}
              size={18}
              color={isEditMode ? "#FFFFFF" : theme.text}
            />
          </Pressable>
        )}
      </View>

      {myRoutes.length === 0 ? (
        <View style={styles.emptyState}>
          <Image
            source={require("../assets/images/empty-states/no-routes.png")}
            style={styles.emptyImage}
          />
          <ThemedText style={styles.emptyTitle}>No routes created yet</ThemedText>
          <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
            Create your first route to share with others
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={myRoutes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            if (isEditMode) {
              return (
                <View style={styles.routeContainer}>
                  <View style={{ flex: 1 }}>
                    <RouteCard route={item} onPress={() => {}} />
                  </View>
                  <View style={[styles.actionButtons, { backgroundColor: theme.surface, marginLeft: Spacing.md }]}>
                    <Pressable
                      style={[styles.actionButton, { backgroundColor: theme.primary }]}
                      onPress={() => handleEditRoute(item.id)}
                    >
                      <Feather name="edit-2" size={18} color="#FFFFFF" />
                    </Pressable>
                    <Pressable
                      style={[styles.actionButton, { backgroundColor: "#F44336" }]}
                      onPress={() => handleDeleteRoute(item.id)}
                    >
                      <Feather name="trash-2" size={18} color="#FFFFFF" />
                    </Pressable>
                  </View>
                </View>
              );
            }
            return (
              <Pressable onPress={() => handleRoutePress(item.id)}>
                <RouteCard route={item} onPress={() => handleRoutePress(item.id)} />
              </Pressable>
            );
          }}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom }]}
        />
      )}

      {showSuccess && (
        <SuccessNotification
          message="Route deleted successfully"
          onClose={() => setShowSuccess(false)}
        />
      )}

      <ConfirmationModal
        visible={showDeleteModal}
        title="Delete Route"
        message="Are you sure you want to delete this route? This action cannot be undone."
        cancelText="Cancel"
        confirmText="Delete"
        isDestructive
        onCancel={() => {
          setShowDeleteModal(false);
          setPendingDeleteId(null);
        }}
        onConfirm={confirmDelete}
      />
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: Typography.h1.fontSize,
    fontWeight: Typography.h1.fontWeight,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: Spacing.lg,
  },
  routeContainer: {
    flexDirection: "row",
    marginBottom: Spacing.md,
  },
  actionButtons: {
    flexDirection: "column",
    gap: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
    width: 60,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
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
