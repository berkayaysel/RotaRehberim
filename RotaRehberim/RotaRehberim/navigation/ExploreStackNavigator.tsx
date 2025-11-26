import { useMemo } from "react";
import { Platform } from "react-native";
import { createNativeStackNavigator, NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import ExploreScreen from "@/screens/ExploreScreen";
import CityRoutesScreen from "@/screens/CityRoutesScreen";
import RouteDetailScreen from "@/screens/RouteDetailScreen";
import CreateRouteScreen from "@/screens/CreateRouteScreen";
import { useTheme } from "@/hooks/useTheme";

export type ExploreStackParamList = {
  ExploreMain: undefined;
  CityRoutes: { cityId: string; cityName: string; country: string };
  RouteDetail: { routeId: string };
  CreateRoute: { cityId?: string; cityName?: string };
};

const Stack = createNativeStackNavigator<ExploreStackParamList>();

export default function ExploreStackNavigator() {
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
        name="ExploreMain"
        component={ExploreScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CityRoutes"
        component={CityRoutesScreen}
        options={({ route }) => ({ title: route.params.cityName })}
      />
      <Stack.Screen
        name="RouteDetail"
        component={RouteDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateRoute"
        component={CreateRouteScreen}
        options={({ route }) => ({ 
          title: route.params?.cityName ? `Create Route in ${route.params.cityName}` : "Create Route",
          headerShown: true 
        })}
      />
    </Stack.Navigator>
  );
}
