import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  Dimensions,
  Image,
  Modal,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Spacing, Typography, BorderRadius } from "@/constants/theme";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { SuccessNotification } from "@/components/SuccessNotification";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_CITIES } from "@/services/mockData";
import { saveCreatedRoute } from "@/services/storage";
import { Route, RouteStop } from "@/types";
const { width } = Dimensions.get("window");

type NavigationProp = NativeStackNavigationProp<any>;

interface StopFormData {
  name: string;
  description: string;
  lat: number;
  lng: number;
}

export default function CreateRouteScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);

  const [title, setTitle] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [category, setCategory] = useState<"walking" | "driving" | "mixed">("walking");

  const [stops, setStops] = useState<StopFormData[]>([]);
  const [currentStop, setCurrentStop] = useState<StopFormData>({
    name: "",
    description: "",
    lat: 41.0082,
    lng: 28.9784,
  });

  const [duration, setDuration] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const countries = useMemo(() => {
    const uniqueCountries = Array.from(new Set(MOCK_CITIES.map((city) => city.country)));
    return uniqueCountries.sort();
  }, []);

  const filteredCities = useMemo(() => {
    return MOCK_CITIES.filter((city) => city.country === selectedCountry);
  }, [selectedCountry]);

  const handleBack = () => {
    if (hasChanges) {
      Alert.alert(
        "Discard Changes?",
        "You have unsaved changes. Are you sure you want to go back?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!title.trim()) newErrors.title = "Title is required";
      if (!selectedCountry) newErrors.country = "Please select a country";
      if (!selectedCityId) newErrors.city = "Please select a city";
    } else if (step === 2) {
      if (stops.length < 2) newErrors.stops = "At least 2 stops are required";
    } else if (step === 3) {
      if (!duration.trim()) newErrors.duration = "Duration is required";
      if (photos.length === 0) newErrors.photos = "At least 1 photo is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        handlePublish();
      }
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleAddStop = () => {
    if (!currentStop.name.trim()) {
      setErrors({ ...errors, stopName: "Stop name is required" });
      return;
    }
    if (!currentStop.description.trim()) {
      setErrors({ ...errors, stopDescription: "Stop description is required" });
      return;
    }

    const newStops = [...stops, currentStop];
    setStops(newStops);
    setCurrentStop({
      name: "",
      description: "",
      lat: 41.0082 + Math.random() * 0.01,
      lng: 28.9784 + Math.random() * 0.01,
    });
    // Clear all errors including stops validation error
    const clearedErrors = { ...errors };
    delete clearedErrors.stopName;
    delete clearedErrors.stopDescription;
    if (newStops.length >= 2) {
      delete clearedErrors.stops;
    }
    setErrors(clearedErrors);
    setHasChanges(true);
  };

  const handleRemoveStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const handlePublish = async () => {
    if (!user) return;

    const newRoute: Route = {
      id: `route-${Date.now()}`,
      cityId: selectedCityId,
      creatorUserId: user.id,
      creatorName: user.name,
      creatorAvatar: user.avatar,
      title,
      description: `${selectedCountry} • ${filteredCities.find((c) => c.id === selectedCityId)?.cityName || ""}`,
      stops: stops as RouteStop[],
      duration,
      distance: `${(stops.length * 0.5).toFixed(1)} km`,
      rating: 0,
      ratingCount: 0,
      ratings: [],
      photos: photos.length > 0 ? photos : ["https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800"],
      category,
      createdAt: new Date().toISOString(),
    };

    await saveCreatedRoute(newRoute);
    setShowSuccessNotification(true);

    setTimeout(() => {
      navigation.goBack();
    }, 2000);
  };

  const handleSuccessNotificationClose = () => {
    setShowSuccessNotification(false);
    navigation.goBack();
  };

  const handlePickPhotos = async () => {
    if (photos.length >= 5) {
      Alert.alert("Maximum photos reached", "You can only add up to 5 photos.");
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please grant photo library access to add photos.");
      return;
    }

    const remainingSlots = 5 - photos.length;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: remainingSlots > 1,
      selectionLimit: remainingSlots,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newPhotos = result.assets.map((asset) => asset.uri);
      const uniquePhotos = [...new Set([...photos, ...newPhotos])];
      setPhotos(uniquePhotos.slice(0, 5));
      setHasChanges(true);
      setErrors({ ...errors, photos: "" });
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map((i) => (
        <View
          key={i}
          style={[
            styles.stepDot,
            {
              backgroundColor: i === step ? theme.primary : theme.border,
            },
          ]}
        />
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <ThemedText style={styles.stepTitle}>Basic Information</ThemedText>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Route Title</ThemedText>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.surface, borderColor: errors.title ? "#F44336" : theme.border, color: theme.text },
          ]}
          placeholder="e.g., Historic Walking Tour"
          placeholderTextColor={theme.textTertiary}
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            setHasChanges(true);
            setErrors({ ...errors, title: "" });
          }}
        />
        {errors.title ? <ThemedText style={styles.errorText}>{errors.title}</ThemedText> : null}
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Country</ThemedText>
        <Pressable
          style={[
            styles.selectButton,
            {
              backgroundColor: theme.surface,
              borderColor: errors.country ? "#F44336" : theme.border,
            },
          ]}
          onPress={() => setShowCountryModal(true)}
        >
          <ThemedText style={{ color: selectedCountry ? theme.text : theme.textSecondary }}>
            {selectedCountry || "Please select a country"}
          </ThemedText>
          <Feather name="chevron-down" size={20} color={theme.textSecondary} />
        </Pressable>
        {errors.country ? <ThemedText style={styles.errorText}>{errors.country}</ThemedText> : null}
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>City</ThemedText>
        <Pressable
          style={[
            styles.selectButton,
            {
              backgroundColor: theme.surface,
              borderColor: errors.city ? "#F44336" : theme.border,
              opacity: selectedCountry ? 1 : 0.5,
            },
          ]}
          disabled={!selectedCountry}
          onPress={() => setShowCityModal(true)}
        >
          <ThemedText style={{ color: selectedCityId ? theme.text : theme.textSecondary }}>
            {selectedCityId ? filteredCities.find((c) => c.id === selectedCityId)?.cityName : "Please select a city"}
          </ThemedText>
          <Feather name="chevron-down" size={20} color={theme.textSecondary} />
        </Pressable>
        {!selectedCountry && <ThemedText style={[styles.errorText, { color: theme.textSecondary }]}>Please select a country first</ThemedText>}
        {errors.city ? <ThemedText style={styles.errorText}>{errors.city}</ThemedText> : null}
      </View>

      <Modal
        visible={showCountryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCountryModal(false)}
      >
        <ThemedView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <ThemedText style={styles.modalTitle}>Select Country</ThemedText>
            <Pressable onPress={() => setShowCountryModal(false)}>
              <Feather name="x" size={24} color={theme.text} />
            </Pressable>
          </View>
          <FlatList
            data={countries}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                style={[
                  styles.modalItem,
                  {
                    backgroundColor: selectedCountry === item ? theme.primary + "20" : theme.surface,
                    borderBottomColor: theme.border,
                  },
                ]}
                onPress={() => {
                  setSelectedCountry(item);
                  setSelectedCityId("");
                  setHasChanges(true);
                  setErrors({ ...errors, country: "" });
                  setShowCountryModal(false);
                }}
              >
                <ThemedText style={[styles.modalItemText, { color: selectedCountry === item ? theme.primary : theme.text }]}>
                  {item}
                </ThemedText>
                {selectedCountry === item && <Feather name="check" size={20} color={theme.primary} />}
              </Pressable>
            )}
          />
        </ThemedView>
      </Modal>

      <Modal
        visible={showCityModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCityModal(false)}
      >
        <ThemedView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <ThemedText style={styles.modalTitle}>Select City</ThemedText>
            <Pressable onPress={() => setShowCityModal(false)}>
              <Feather name="x" size={24} color={theme.text} />
            </Pressable>
          </View>
          <FlatList
            data={filteredCities}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={[
                  styles.modalItem,
                  {
                    backgroundColor: selectedCityId === item.id ? theme.primary + "20" : theme.surface,
                    borderBottomColor: theme.border,
                  },
                ]}
                onPress={() => {
                  setSelectedCityId(item.id);
                  setHasChanges(true);
                  setErrors({ ...errors, city: "" });
                  setShowCityModal(false);
                }}
              >
                <ThemedText style={[styles.modalItemText, { color: selectedCityId === item.id ? theme.primary : theme.text }]}>
                  {item.cityName}
                </ThemedText>
                {selectedCityId === item.id && <Feather name="check" size={20} color={theme.primary} />}
              </Pressable>
            )}
          />
        </ThemedView>
      </Modal>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Category</ThemedText>
        <View style={styles.categorySelector}>
          {[
            { value: "walking", icon: "user", label: "Walking" },
            { value: "driving", icon: "navigation", label: "Driving" },
            { value: "mixed", icon: "shuffle", label: "Mixed" },
          ].map((item) => (
            <Pressable
              key={item.value}
              style={[
                styles.categoryButton,
                {
                  backgroundColor: category === item.value ? theme.primary : theme.surface,
                  borderColor: category === item.value ? theme.primary : theme.border,
                },
              ]}
              onPress={() => {
                setCategory(item.value as typeof category);
                setHasChanges(true);
              }}
            >
              <Feather
                name={item.icon as any}
                size={20}
                color={category === item.value ? "#FFFFFF" : theme.text}
              />
              <ThemedText
                style={[
                  styles.categoryLabel,
                  { color: category === item.value ? "#FFFFFF" : theme.text },
                ]}
              >
                {item.label}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => {
    const MapVisualization = require("@/components/MapVisualization").MapVisualization;
    return (
      <View style={styles.stepContainer}>
        <ThemedText style={styles.stepTitle}>Add Route Stops</ThemedText>

        {stops.length > 0 && (
          <MapVisualization stops={stops} width={350} height={220} />
        )}
        {stops.length === 0 && (
          <View style={[styles.mapPlaceholder, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
            <Feather name="map-pin" size={48} color={theme.textTertiary} />
            <ThemedText style={[styles.mapPlaceholderText, { color: theme.textSecondary }]}>
              Add stops to see map
            </ThemedText>
          </View>
        )}

        <View style={styles.stopForm}>
          <ThemedText style={styles.label}>Stop Name</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: theme.surface, borderColor: errors.stopName ? "#F44336" : theme.border, color: theme.text }]}
            placeholder="e.g., Main Square"
            placeholderTextColor={theme.textTertiary}
            value={currentStop.name}
            onChangeText={(text) => {
              setCurrentStop({ ...currentStop, name: text });
              setErrors({ ...errors, stopName: "" });
            }}
          />
          {errors.stopName ? <ThemedText style={styles.errorText}>{errors.stopName}</ThemedText> : null}

          <ThemedText style={[styles.label, { marginTop: Spacing.md }]}>Stop Description</ThemedText>
          <TextInput
            style={[styles.textArea, { backgroundColor: theme.surface, borderColor: errors.stopDescription ? "#F44336" : theme.border, color: theme.text }]}
            placeholder="Describe this stop so other travelers can learn about it..."
            placeholderTextColor={theme.textTertiary}
            value={currentStop.description}
            onChangeText={(text) => {
              setCurrentStop({ ...currentStop, description: text });
              setErrors({ ...errors, stopDescription: "" });
            }}
            multiline
            numberOfLines={3}
          />
          {errors.stopDescription ? <ThemedText style={styles.errorText}>{errors.stopDescription}</ThemedText> : null}

          <Pressable
            style={[styles.addButton, { backgroundColor: theme.primary, marginTop: Spacing.md }]}
            onPress={handleAddStop}
          >
            <Feather name="plus" size={20} color="#FFFFFF" />
            <ThemedText style={styles.addButtonText}>Add Stop</ThemedText>
          </Pressable>
        </View>

        {stops.length > 0 && (
          <View style={styles.stopsList}>
            <ThemedText style={styles.stopsListTitle}>Stops ({stops.length})</ThemedText>
            {stops.map((stop, index) => (
              <View
                key={index}
                style={[styles.stopItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
              >
                <View style={styles.stopItemContent}>
                  <View style={[styles.stopNumber, { backgroundColor: theme.primary }]}>
                    <ThemedText style={styles.stopNumberText}>{index + 1}</ThemedText>
                  </View>
                  <View style={styles.stopItemText}>
                    <ThemedText style={styles.stopItemName}>{stop.name}</ThemedText>
                    <ThemedText style={[styles.stopItemDescription, { color: theme.textSecondary }]}>
                      {stop.description}
                    </ThemedText>
                  </View>
                </View>
                <Pressable onPress={() => handleRemoveStop(index)}>
                  <Feather name="trash-2" size={20} color="#F44336" />
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {errors.stops ? <ThemedText style={styles.errorText}>{errors.stops}</ThemedText> : null}
      </View>
    );
  };

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <ThemedText style={styles.stepTitle}>Duration & Photos</ThemedText>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Duration</ThemedText>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.surface, borderColor: errors.duration ? "#F44336" : theme.border, color: theme.text },
          ]}
          placeholder="e.g., 3 hours"
          placeholderTextColor={theme.textTertiary}
          value={duration}
          onChangeText={(text) => {
            setDuration(text);
            setHasChanges(true);
            setErrors({ ...errors, duration: "" });
          }}
        />
        {errors.duration ? <ThemedText style={styles.errorText}>{errors.duration}</ThemedText> : null}
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Photos (Max 5)</ThemedText>
        <Pressable
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={handlePickPhotos}
        >
          <Feather name="image" size={20} color="#FFFFFF" />
          <ThemedText style={styles.addButtonText}>
            Add Photos ({photos.length}/5)
          </ThemedText>
        </Pressable>
        {errors.photos ? <ThemedText style={styles.errorText}>{errors.photos}</ThemedText> : null}

        {photos.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.photoScroll, { marginTop: Spacing.md }]}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoContainer}>
                <Image source={{ uri: photo }} style={styles.photo} />
                <Pressable
                  style={styles.removePhotoButton}
                  onPress={() => handleRemovePhoto(index)}
                >
                  <Feather name="x" size={16} color="#FFFFFF" />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {showSuccessNotification && (
        <SuccessNotification
          message="Route added successfully!"
          onClose={handleSuccessNotificationClose}
        />
      )}
      
      <View style={[styles.header, { paddingTop: Spacing.lg, paddingHorizontal: Spacing.lg }]}>
        <Pressable onPress={handleBack}>
          <Feather name="chevron-left" size={28} color={theme.text} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Create Route</ThemedText>
        <View style={{ width: 28 }} />
      </View>

      {renderStepIndicator()}

      <ScreenScrollView style={styles.content}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </ScreenScrollView>

      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        {step > 1 && (
          <Pressable
            style={[styles.button, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }]}
            onPress={handlePrevious}
          >
            <ThemedText style={[styles.buttonText, { color: theme.text }]}>Back</ThemedText>
          </Pressable>
        )}
        <Pressable
          style={[styles.button, { backgroundColor: "#2B7A4B", flex: step === 1 ? 1 : undefined }]}
          onPress={handleNext}
        >
          <ThemedText style={[styles.buttonText, { color: "#FFFFFF" }]}>
            {step === 3 ? "Publish Route" : "Next"}
          </ThemedText>
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
    flex: 1,
    padding: Spacing.lg,
  },
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stepContainer: {
    gap: Spacing.lg,
  },
  stepTitle: {
    fontSize: Typography.h2.fontSize,
    fontWeight: Typography.h2.fontWeight,
  },
  inputGroup: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: Typography.body.fontSize,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.body.fontSize,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.body.fontSize,
    textAlignVertical: "top",
  },
  errorText: {
    color: "#F44336",
    fontSize: Typography.caption.fontSize,
  },
  citySelector: {
    marginHorizontal: -Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  cityChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    marginRight: Spacing.md,
  },
  cityChipText: {
    fontSize: Typography.body.fontSize,
    fontWeight: "600",
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  modalContainer: {
    flex: 1,
    paddingTop: Spacing.xl,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: Typography.h3.fontSize,
    fontWeight: "600",
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
  },
  modalItemText: {
    fontSize: Typography.body.fontSize,
    fontWeight: "500",
  },
  categorySelector: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  categoryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
  },
  categoryLabel: {
    fontSize: Typography.caption.fontSize,
    fontWeight: "600",
  },
  mapPlaceholder: {
    height: 220,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.md,
  },
  mapPlaceholderText: {
    fontSize: Typography.body.fontSize,
  },
  stopForm: {
    gap: Spacing.md,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xs,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: Typography.body.fontSize,
    fontWeight: "600",
  },
  stopsList: {
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  stopsListTitle: {
    fontSize: Typography.h3.fontSize,
    fontWeight: "600",
  },
  stopItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
  },
  stopItemContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  stopNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  stopNumberText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  stopItemText: {
    flex: 1,
  },
  stopItemName: {
    fontSize: Typography.body.fontSize,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  stopItemDescription: {
    fontSize: Typography.caption.fontSize,
  },
  photoScroll: {
    marginHorizontal: -Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  photoContainer: {
    position: "relative",
    marginRight: Spacing.md,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.xs,
  },
  removePhotoButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#F44336",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg + 60,
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
