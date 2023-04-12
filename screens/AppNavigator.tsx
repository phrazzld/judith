import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AuthScreen from "./AuthScreen";
import ChatScreen from "./ChatScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Auth">
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ title: "Auth" }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ title: "Chat", headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
