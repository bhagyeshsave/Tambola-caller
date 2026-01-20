import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import GeneratorScreen from "@/screens/GeneratorScreen";
import HistoryScreen, { HistoryClearButton } from "@/screens/HistoryScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type RootStackParamList = {
  Generator: undefined;
  History: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Generator"
        component={GeneratorScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{
          headerTitle: "History",
          headerRight: () => <HistoryClearButton />,
        }}
      />
    </Stack.Navigator>
  );
}
