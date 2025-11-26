import * as Location from "expo-location";
import { Route } from "@/types";

const EARTH_RADIUS = 6371; // km

export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) *
      Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS * c;
}

export async function requestLocationPermission(): Promise<boolean> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Error requesting location permission:", error);
    return false;
  }
}

export async function getCurrentLocation(): Promise<{
  latitude: number;
  longitude: number;
} | null> {
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error("Error getting current location:", error);
    return null;
  }
}

export async function getNearbyRoutes(
  routes: Route[],
  radiusKm: number = 50
): Promise<Route[]> {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) {
    console.warn("Location permission not granted");
    return [];
  }

  const userLocation = await getCurrentLocation();
  if (!userLocation) {
    console.warn("Could not get user location");
    return [];
  }

  return routes
    .map((route) => {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        40.7128, // Default to NYC if no lat/lng
        -74.006
      );
      return { ...route, distance };
    })
    .filter((route) => (route.distance as any) <= radiusKm)
    .sort((a, b) => ((a.distance as any) || 0) - ((b.distance as any) || 0))
    .slice(0, 10);
}
