import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StartScreen from "@/screens/StartScreen";
import MainTabNavigator from "./MainTabNavigator";

export type RootStackParamList = {
  Start: undefined;
  MainTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Start"
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <Stack.Screen name="Start" component={StartScreen} />
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
    </Stack.Navigator>
  );
}
