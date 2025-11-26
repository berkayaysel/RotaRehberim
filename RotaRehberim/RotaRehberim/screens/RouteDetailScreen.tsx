import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Image, Pressable, Dimensions, Alert } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Spacing, Typography, BorderRadius } from "@/constants/theme";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { AddReviewModal } from "@/components/AddReviewModal";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { getRouteByIdWithRatings } from "@/services/mockData";
import { getFavorites, addFavorite, removeFavorite } from "@/services/storage";
import { addRating } from "@/services/storage";
import { getAvatarSource } from "@/utils/avatars";

const { width } = Dimensions.get("window");

export default function RouteDetailScreen() {
  const route = useRoute<RouteProp<{ params: { routeId: string } }>>();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [routeData, setRouteData] = useState<any>(null);

  useEffect(() => {
    loadRouteData();
    checkFavorite();
  }, [route.params.routeId]);

  const loadRouteData = async () => {
    try {
      const data = await getRouteByIdWithRatings(route.params.routeId);
      setRouteData(data);
    } catch (error) {
      console.error("Failed to load route data:", error);
    }
  };

  const checkFavorite = async () => {
    const favorites = await getFavorites();
    setIsFavorite(favorites.includes(route.params.routeId));
  };

  const toggleFavorite = async () => {
    if (isFavorite) {
      await removeFavorite(route.params.routeId);
    } else {
      await addFavorite(route.params.routeId);
    }
    setIsFavorite(!isFavorite);
  };

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to submit a review.");
      return;
    }

    const newRating = {
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      rate: rating,
      comment,
      date: new Date().toISOString(),
    };

    if (routeData) {
      const updatedRatings = [...routeData.ratings, newRating];
      const totalRating = updatedRatings.reduce((sum, r) => sum + r.rate, 0);
      const avgRating = updatedRatings.length > 0 ? totalRating / updatedRatings.length : 0;

      setRouteData({
        ...routeData,
        ratings: updatedRatings,
        rating: avgRating,
        ratingCount: updatedRatings.length,
      });
    }

    await addRating(route.params.routeId, newRating);
    setShowReviewModal(false);
  };

  if (!routeData) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Route not found</ThemedText>
      </ThemedView>
    );
  }

  const getCategoryIcon = () => {
    switch (routeData.category) {
      case "walking":
        return "user";
      case "driving":
        return "truck";
      case "mixed":
        return "shuffle";
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl + Spacing.buttonHeight }]}>
        <View style={styles.mapContainer}>
          <Image source={{ uri: routeData.photos[0] }} style={styles.mapImage} />
          <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
            <Pressable
              style={({ pressed }) => [
                styles.headerButton,
                { backgroundColor: theme.surface },
                pressed && styles.pressed,
              ]}
              onPress={() => navigation.goBack()}
            >
              <Feather name="arrow-left" size={20} color={theme.text} />
            </Pressable>
            <View style={styles.headerActions}>
              <Pressable
                style={({ pressed }) => [
                  styles.headerButton,
                  { backgroundColor: theme.surface },
                  pressed && styles.pressed,
                ]}
                onPress={toggleFavorite}
              >
                <Feather
                  name="heart"
                  size={20}
                  color={isFavorite ? "#F44336" : theme.text}
                />
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.headerButton,
                  { backgroundColor: theme.surface },
                  pressed && styles.pressed,
                ]}
              >
                <Feather name="share-2" size={20} color={theme.text} />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <ThemedText style={styles.title}>{routeData.title}</ThemedText>

          <View style={styles.creator}>
            <Image
              source={getAvatarSource(routeData.creatorAvatar)}
              style={styles.avatar}
            />
            <View>
              <ThemedText style={styles.creatorName}>{routeData.creatorName}</ThemedText>
              <ThemedText style={[styles.date, { color: theme.textSecondary }]}>
                {new Date(routeData.createdAt).toLocaleDateString()}
              </ThemedText>
            </View>
          </View>

          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Feather
                  key={star}
                  name="star"
                  size={20}
                  color={star <= Math.round(routeData.rating) ? "#FFC107" : theme.border}
                />
              ))}
            </View>
            <ThemedText style={styles.ratingText}>
              {routeData.rating.toFixed(1)} ({routeData.ratingCount} reviews)
            </ThemedText>
          </View>

          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: theme.backgroundDefault }]}>
              <Feather name="clock" size={16} color={theme.text} />
              <ThemedText style={styles.badgeText}>{routeData.duration}</ThemedText>
            </View>
            {routeData.distance && (
              <View style={[styles.badge, { backgroundColor: theme.backgroundDefault }]}>
                <Feather name="map-pin" size={16} color={theme.text} />
                <ThemedText style={styles.badgeText}>{routeData.distance}</ThemedText>
              </View>
            )}
            <View style={[styles.badge, { backgroundColor: theme.backgroundDefault }]}>
              <Feather name={getCategoryIcon()} size={16} color={theme.text} />
              <ThemedText style={styles.badgeText}>{routeData.category}</ThemedText>
            </View>
          </View>

          <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
            {routeData.description}
          </ThemedText>
        </View>

        {routeData.stops.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Route Map</ThemedText>
            <View style={styles.mapContainer}>
              {(() => {
                const { MapVisualization } = require("@/components/MapVisualization");
                return <MapVisualization stops={routeData.stops} width={350} height={280} />;
              })()}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Stops ({routeData.stops.length})</ThemedText>
          {routeData.stops.map((stop, index) => (
            <View key={index} style={[styles.stopCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={[styles.stopNumber, { backgroundColor: theme.primary }]}>
                <ThemedText style={styles.stopNumberText}>{index + 1}</ThemedText>
              </View>
              <View style={styles.stopContent}>
                <ThemedText style={styles.stopName}>{stop.name}</ThemedText>
                <ThemedText style={[styles.stopDescription, { color: theme.textSecondary }]}>
                  {stop.description}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>

        {routeData.photos.length > 1 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Photos</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {routeData.photos.map((photo, index) => (
                <Image key={index} source={{ uri: photo }} style={styles.photoCard} />
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.reviewsHeader}>
            <ThemedText style={styles.sectionTitle}>Reviews ({routeData.ratings.length})</ThemedText>
            <Pressable
              style={({ pressed }) => [
                styles.addReviewButton,
                { backgroundColor: "#2B7A4B" },
                pressed && styles.pressed,
              ]}
              onPress={() => setShowReviewModal(true)}
            >
              <Feather name="plus" size={16} color="#FFFFFF" />
              <ThemedText style={styles.addReviewText}>Add Review</ThemedText>
            </Pressable>
          </View>
          {routeData.ratings.length === 0 ? (
            <ThemedText style={[styles.noReviews, { color: theme.textSecondary }]}>
              No reviews yet. Be the first to review!
            </ThemedText>
          ) : (
            routeData.ratings.map((rating, index) => (
              <View key={index} style={[styles.reviewCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.reviewHeader}>
                  <Image
                    source={getAvatarSource(rating.userAvatar)}
                    style={styles.reviewAvatar}
                  />
                  <View style={styles.reviewHeaderContent}>
                    <ThemedText style={styles.reviewUserName}>{rating.userName}</ThemedText>
                    <View style={styles.reviewStars}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Feather
                          key={star}
                          name="star"
                          size={12}
                          color={star <= rating.rate ? "#FFC107" : theme.border}
                        />
                      ))}
                    </View>
                  </View>
                  <ThemedText style={[styles.reviewDate, { color: theme.textSecondary }]}>
                    {new Date(rating.date).toLocaleDateString()}
                  </ThemedText>
                </View>
                <ThemedText style={[styles.reviewComment, { color: theme.textSecondary }]}>
                  {rating.comment}
                </ThemedText>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.backgroundRoot, paddingBottom: insets.bottom }]}>
        <Pressable
          style={({ pressed }) => [
            styles.navigationButton,
            { backgroundColor: theme.primary },
            pressed && styles.pressed,
          ]}
        >
          <Feather name="navigation" size={20} color="#FFFFFF" />
          <ThemedText style={styles.navigationButtonText}>Start Navigation</ThemedText>
        </Pressable>
      </View>

      <AddReviewModal
        visible={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleSubmitReview}
        routeTitle={routeData.title}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: Spacing["3xl"],
  },
  mapContainer: {
    height: 300,
    position: "relative",
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerActions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  infoCard: {
    marginTop: -Spacing.xl,
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  title: {
    fontSize: Typography.h1.fontSize,
    fontWeight: Typography.h1.fontWeight,
    marginBottom: Spacing.md,
  },
  creator: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  creatorName: {
    fontSize: Typography.body.fontSize,
    fontWeight: Typography.h3.fontWeight,
  },
  date: {
    fontSize: Typography.caption.fontSize,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  stars: {
    flexDirection: "row",
    gap: 2,
  },
  ratingText: {
    fontSize: Typography.small.fontSize,
  },
  badges: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xs,
  },
  badgeText: {
    fontSize: Typography.caption.fontSize,
  },
  description: {
    fontSize: Typography.body.fontSize,
  },
  section: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.h2.fontSize,
    fontWeight: Typography.h2.fontWeight,
    marginBottom: Spacing.md,
  },
  stopCard: {
    flexDirection: "row",
    padding: Spacing.md,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  stopNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  stopNumberText: {
    fontSize: Typography.small.fontSize,
    fontWeight: Typography.h3.fontWeight,
    color: "#FFFFFF",
  },
  stopContent: {
    flex: 1,
  },
  stopName: {
    fontSize: Typography.body.fontSize,
    fontWeight: Typography.h3.fontWeight,
    marginBottom: Spacing.xs,
  },
  stopDescription: {
    fontSize: Typography.small.fontSize,
  },
  photoCard: {
    width: width * 0.7,
    height: 200,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.md,
  },
  reviewCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: Spacing.sm,
  },
  reviewHeaderContent: {
    flex: 1,
  },
  reviewUserName: {
    fontSize: Typography.small.fontSize,
    fontWeight: Typography.h3.fontWeight,
    marginBottom: 2,
  },
  reviewStars: {
    flexDirection: "row",
    gap: 2,
  },
  reviewDate: {
    fontSize: Typography.caption.fontSize,
  },
  reviewComment: {
    fontSize: Typography.small.fontSize,
  },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  addReviewButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  addReviewText: {
    fontSize: Typography.small.fontSize,
    fontWeight: Typography.button.fontWeight,
    color: "#FFFFFF",
  },
  noReviews: {
    fontSize: Typography.body.fontSize,
    textAlign: "center",
    paddingVertical: Spacing.xl,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  navigationButton: {
    height: Spacing.buttonHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BorderRadius.xs,
    gap: Spacing.sm,
  },
  navigationButtonText: {
    fontSize: Typography.button.fontSize,
    fontWeight: Typography.button.fontWeight,
    color: "#FFFFFF",
  },
  pressed: {
    opacity: 0.7,
  },
});
