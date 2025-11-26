import { useMemo } from "react";
import { Platform } from "react-native";
import { createNativeStackNavigator, NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import FavoritesScreen from "@/screens/FavoritesScreen";
import RouteDetailScreen from "@/screens/RouteDetailScreen";
import { useTheme } from "@/hooks/useTheme";

export type FavoritesStackParamList = {
  FavoritesList: undefined;
  RouteDetail: { routeId: string };
};

const Stack = createNativeStackNavigator<FavoritesStackParamList>();

export default function FavoritesStackNavigator() {
  const { theme, isDark } = useTheme();
  
  const screenOptions = useMemo<NativeStackNavigationOptions>(() => ({
    headerTitleAlign: "center",
    headerTransparent: true,
    headerBlurEffect: isDark ? "dark" : "light",
    headerTintColor: theme.text,
    headerStyle: {
      backgroundColor: Platform.select({
        ios: undefined,
        android: theme.backgroundRoot,
        web: theme.backgroundRoot,
      }),
    },
    gestureEnabled: true,
    gestureDirection: "horizontal",
    fullScreenGestureEnabled: isLiquidGlassAvailable() ? false : true,
    contentStyle: {
      backgroundColor: theme.backgroundRoot,
    },
  }), [theme, isDark]);

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="FavoritesList"
        component={FavoritesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RouteDetail"
        component={RouteDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
