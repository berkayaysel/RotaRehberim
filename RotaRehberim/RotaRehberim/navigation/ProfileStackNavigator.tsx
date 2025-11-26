import { useMemo } from "react";
import { Platform } from "react-native";
import { createNativeStackNavigator, NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import ProfileScreen from "@/screens/ProfileScreen";
import MyRoutesScreen from "@/screens/MyRoutesScreen";
import RouteDetailScreen from "@/screens/RouteDetailScreen";
import CreateRouteScreen from "@/screens/CreateRouteScreen";
import ClearCreatedRoutesScreen from "@/screens/ClearCreatedRoutesScreen";
import EditProfileScreen from "@/screens/EditProfileScreen";
import HelpSupportScreen from "@/screens/HelpSupportScreen";
import { useTheme } from "@/hooks/useTheme";

export type ProfileStackParamList = {
  ProfileMain: undefined;
  MyRoutes: undefined;
  RouteDetail: { routeId: string };
  CreateRoute: { cityId?: string; cityName?: string };
  ClearRoutes: undefined;
  EditProfile: undefined;
  HelpSupport: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStackNavigator() {
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
        name="ProfileMain"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyRoutes"
        component={MyRoutesScreen}
        options={{ title: "My Routes" }}
      />
      <Stack.Screen
        name="RouteDetail"
        component={RouteDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateRoute"
        component={CreateRouteScreen}
        options={{ title: "Create Route", headerShown: true }}
      />
      <Stack.Screen
        name="ClearRoutes"
        component={ClearCreatedRoutesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HelpSupport"
        component={HelpSupportScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
