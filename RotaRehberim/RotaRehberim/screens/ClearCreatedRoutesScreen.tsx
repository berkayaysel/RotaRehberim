import React, { useState, useMemo } from "react";
import { View, StyleSheet, FlatList, Pressable } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { Spacing, Typography, BorderRadius } from "@/constants/theme";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SuccessNotification } from "@/components/SuccessNotification";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { useTheme } from "@/hooks/useTheme";
import { getCreatedRoutes, deleteCreatedRoute } from "@/services/storage";
import { Route } from "@/types";

type NavigationProp = NativeStackNavigationProp<any>;

export default function ClearCreatedRoutesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [deletedCount, setDeletedCount] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDeleteCount, setPendingDeleteCount] = useState(0);
  const [pendingRoutesToDelete, setPendingRoutesToDelete] = useState<string[]>([]);
  
  // Draggable FAB state
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  useFocusEffect(
    React.useCallback(() => {
      const loadRoutes = async () => {
        const createdRoutes = await getCreatedRoutes();
        setRoutes(createdRoutes);
        setLoading(false);
        setSelectedIds(new Set());
      };
      loadRoutes();
    }, [])
  );

  const isAllSelected = useMemo(() => {
    return routes.length > 0 && selectedIds.size === routes.length;
  }, [selectedIds, routes]);

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(routes.map((r) => r.id)));
    }
  };

  const handleSelectRoute = (routeId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(routeId)) {
      newSelected.delete(routeId);
    } else {
      newSelected.add(routeId);
    }
    setSelectedIds(newSelected);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) {
      return;
    }

    const countToDelete = selectedIds.size;
    const routesToDelete = Array.from(selectedIds);
    
    setPendingRoutesToDelete(routesToDelete);
    setPendingDeleteCount(countToDelete);
    setShowDeleteModal(true);
  };

  const performDelete = async () => {
    try {
      setShowDeleteModal(false);
      for (const routeId of pendingRoutesToDelete) {
        await deleteCreatedRoute(routeId);
      }
      // Reload routes fresh from storage
      const updatedRoutes = await getCreatedRoutes();
      setRoutes(updatedRoutes);
      setSelectedIds(new Set());
      setDeletedCount(pendingDeleteCount);
      setShowSuccessNotification(true);

      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 2000);
    } catch (error) {
      console.error("Error deleting routes:", error);
    }
  };

  const handleSuccessNotificationClose = () => {
    setShowSuccessNotification(false);
  };

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = startX.value + e.translationX;
      translateY.value = startY.value + e.translationY;
    })
    .onEnd(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const renderRoute = ({ item }: { item: Route }) => {
    const isSelected = selectedIds.has(item.id);
    return (
      <Pressable
        style={[
          styles.routeItem,
          {
            backgroundColor: isSelected ? theme.primary + "20" : theme.surface,
            borderColor: isSelected ? theme.primary : theme.border,
          },
        ]}
        onPress={() => handleSelectRoute(item.id)}
      >
        <View
          style={[
            styles.checkbox,
            {
              borderColor: isSelected ? theme.primary : theme.border,
              backgroundColor: isSelected ? theme.primary : "transparent",
            },
          ]}
        >
          {isSelected && <Feather name="check" size={16} color="#FFFFFF" />}
        </View>
        <View style={styles.routeInfo}>
          <ThemedText style={styles.routeTitle}>{item.title}</ThemedText>
          <ThemedText style={[styles.routeDetails, { color: theme.textSecondary }]}>
            {item.description}
          </ThemedText>
        </View>
      </Pressable>
    );
  };

  return (
    <GestureHandlerRootView style={[styles.container, { backgroundColor: theme.background }]}>
      <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
        {showSuccessNotification && (
          <SuccessNotification
            message={`${deletedCount} route(s) removed successfully!`}
            onClose={handleSuccessNotificationClose}
          />
        )}

        <View style={[styles.header, { paddingTop: Spacing.lg, paddingHorizontal: Spacing.lg }]}>
          <Pressable onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={28} color={theme.text} />
          </Pressable>
          <ThemedText style={styles.headerTitle}>Clear Routes</ThemedText>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.contentWrapper}>
          {routes.length === 0 && !loading ? (
            <View style={styles.emptyState}>
              <Feather name="inbox" size={48} color={theme.textTertiary} />
              <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
                No created routes yet
              </ThemedText>
            </View>
          ) : (
            <>
              <View style={[styles.selectAllButton, { borderBottomColor: theme.border }]}>
                <Pressable
                  style={styles.selectAllContent}
                  onPress={handleSelectAll}
                >
                  <View
                    style={[
                      styles.checkbox,
                      {
                        borderColor: isAllSelected ? theme.primary : theme.border,
                        backgroundColor: isAllSelected ? theme.primary : "transparent",
                      },
                    ]}
                  >
                    {isAllSelected && <Feather name="check" size={16} color="#FFFFFF" />}
                  </View>
                  <ThemedText style={styles.selectAllText}>
                    Select All ({selectedIds.size}/{routes.length})
                  </ThemedText>
                </Pressable>
              </View>

              <FlatList
                data={routes}
                renderItem={renderRoute}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                scrollEnabled={true}
              />
            </>
          )}
        </View>

        {routes.length > 0 && (
          <Animated.View
            style={[
              styles.fabContainer,
              {
                bottom: insets.bottom + Spacing.lg,
                right: Spacing.lg,
              },
              animatedStyle,
            ]}
          >
            <Pressable
              style={[
                styles.fab,
                {
                  backgroundColor: selectedIds.size > 0 ? "#F44336" : theme.textTertiary,
                },
              ]}
              onPress={() => {
                if (selectedIds.size > 0) {
                  handleDeleteSelected();
                }
              }}
            >
              <View style={styles.fabContent}>
                <Feather name="trash-2" size={20} color="#FFFFFF" />
                <ThemedText style={styles.fabText}>
                  {selectedIds.size}
                </ThemedText>
              </View>
            </Pressable>
          </Animated.View>
        )}
      </ThemedView>

      <ConfirmationModal
        visible={showDeleteModal}
        title="Remove Selected Routes"
        message={`Are you sure you want to remove ${pendingDeleteCount} route(s)? This action cannot be undone.`}
        cancelText="Cancel"
        confirmText="Remove"
        isDestructive
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={performDelete}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  contentWrapper: {
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
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.body.fontSize,
  },
  selectAllButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  selectAllContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  selectAllText: {
    fontSize: Typography.body.fontSize,
    fontWeight: "600",
  },
  listContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  routeItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    gap: Spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  routeInfo: {
    flex: 1,
  },
  routeTitle: {
    fontSize: Typography.body.fontSize,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  routeDetails: {
    fontSize: Typography.caption.fontSize,
  },
  footer: {
    flexDirection: "row",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
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
  fabContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabContent: {
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
  fabText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

