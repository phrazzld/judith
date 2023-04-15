import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "judith/screens/AccountScreen";
import AuthScreen from "judith/screens/AuthScreen";
import ChatScreen from "judith/screens/ChatScreen";
import React from "react";
import { TouchableOpacity } from "react-native";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Auth">
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ title: "Auth", headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ navigation }) => ({
          title: "Chat",
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate("Account")}>
              <Ionicons
                name="person-circle-outline"
                size={30}
                color="black"
                style={{ marginRight: 15 }}
              />
            </TouchableOpacity>
          ),
          headerLeft: () => null,
        })}
      />
      <Stack.Screen
        name="Account"
        component={AccountScreen}
        options={{ title: "Account" }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
