import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "judith/screens/AppNavigator";
import React from "react";

export default function App() {
  // TODO: Persist auth state
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
