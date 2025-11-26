import AsyncStorage from "@react-native-async-storage/async-storage";
import { Route, Rating } from "@/types";

const FAVORITES_KEY = "favorites";
const USER_ROUTES_KEY = "user_routes";
const CREATED_ROUTES_KEY = "created_routes";
const RATINGS_KEY = "ratings";

export async function getFavorites(): Promise<string[]> {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load favorites:", error);
    return [];
  }
}

export async function addFavorite(routeId: string): Promise<void> {
  try {
    const favorites = await getFavorites();
    if (!favorites.includes(routeId)) {
      favorites.push(routeId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error("Failed to add favorite:", error);
  }
}

export async function removeFavorite(routeId: string): Promise<void> {
  try {
    const favorites = await getFavorites();
    const updated = favorites.filter((id) => id !== routeId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to remove favorite:", error);
  }
}

export async function isFavorite(routeId: string): Promise<boolean> {
  const favorites = await getFavorites();
  return favorites.includes(routeId);
}

export async function getUserRoutes(): Promise<string[]> {
  try {
    const data = await AsyncStorage.getItem(USER_ROUTES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load user routes:", error);
    return [];
  }
}

export async function addUserRoute(routeId: string): Promise<void> {
  try {
    const routes = await getUserRoutes();
    if (!routes.includes(routeId)) {
      routes.push(routeId);
      await AsyncStorage.setItem(USER_ROUTES_KEY, JSON.stringify(routes));
    }
  } catch (error) {
    console.error("Failed to add user route:", error);
  }
}

export async function getCreatedRoutes(): Promise<Route[]> {
  try {
    const data = await AsyncStorage.getItem(CREATED_ROUTES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load created routes:", error);
    return [];
  }
}

export async function saveCreatedRoute(route: Route): Promise<void> {
  try {
    const routes = await getCreatedRoutes();
    const index = routes.findIndex((r) => r.id === route.id);
    if (index >= 0) {
      routes[index] = route;
    } else {
      routes.push(route);
    }
    await AsyncStorage.setItem(CREATED_ROUTES_KEY, JSON.stringify(routes));
    await addUserRoute(route.id);
  } catch (error) {
    console.error("Failed to save created route:", error);
  }
}

export async function clearCreatedRoutes(): Promise<void> {
  try {
    await AsyncStorage.setItem(CREATED_ROUTES_KEY, JSON.stringify([]));
  } catch (error) {
    console.error("Failed to clear created routes:", error);
  }
}

export async function deleteCreatedRoute(routeId: string): Promise<void> {
  try {
    console.log("deleteCreatedRoute called with ID:", routeId);
    const routes = await getCreatedRoutes();
    console.log("Routes before delete:", routes.map(r => r.id));
    
    const updated = routes.filter((r) => r.id !== routeId);
    console.log("Routes after filter:", updated.map(r => r.id));
    
    await AsyncStorage.setItem(CREATED_ROUTES_KEY, JSON.stringify(updated));
    console.log("Routes saved to storage");
    
    // Also remove from user routes
    const userRoutes = await getUserRoutes();
    const updatedUserRoutes = userRoutes.filter((id) => id !== routeId);
    await AsyncStorage.setItem(USER_ROUTES_KEY, JSON.stringify(updatedUserRoutes));
    console.log("User routes updated");
  } catch (error) {
    console.error("Failed to delete created route:", error);
    throw error;
  }
}

export async function getRatings(routeId: string): Promise<Rating[]> {
  try {
    const data = await AsyncStorage.getItem(`${RATINGS_KEY}_${routeId}`);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load ratings:", error);
    return [];
  }
}

export async function addRating(routeId: string, rating: Rating): Promise<void> {
  try {
    const ratings = await getRatings(routeId);
    ratings.push(rating);
    await AsyncStorage.setItem(`${RATINGS_KEY}_${routeId}`, JSON.stringify(ratings));
  } catch (error) {
    console.error("Failed to add rating:", error);
  }
}
