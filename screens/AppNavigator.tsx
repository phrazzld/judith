import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "judith/colors";
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "judith/screens/AccountScreen";
import AuthScreen from "judith/screens/AuthScreen";
import ChatScreen from "judith/screens/ChatScreen";
/* import VoiceChatScreen from "judith/screens/VoiceChatScreen"; */
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
          title: "Judith",
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate("Account")}>
              <Ionicons
                name="person-circle-outline"
                size={30}
                color={COLORS.darkGray}
                style={{ marginRight: 15 }}
              />
            </TouchableOpacity>
          ),
          headerLeft: () => null
          /* headerLeft: () => ( */
          /*   <TouchableOpacity onPress={() => navigation.navigate("VoiceChat")}> */
          /*     <Ionicons */
          /*       name="mic-outline" */
          /*       size={30} */
          /*       color="black" */
          /*       style={{ marginLeft: 15 }} */
          /*     /> */
          /*   </TouchableOpacity> */
          /* ), */
        })}
      />
      {/* <Stack.Screen */}
      {/*   name="VoiceChat" */}
      {/*   component={VoiceChatScreen} */}
      {/*   options={({ navigation }) => ({ */}
      {/*     title: "Judith", */}
      {/*     headerStyle: { */}
      {/*       backgroundColor: COLORS.tertiary, */}
      {/*     }, */}
      {/*     headerShown: true, */}
      {/*     headerRight: () => ( */}
      {/*       <TouchableOpacity onPress={() => navigation.navigate("Account")}> */}
      {/*         <Ionicons */}
      {/*           name="person-circle-outline" */}
      {/*           size={30} */}
      {/*           color="black" */}
      {/*           style={{ marginRight: 15 }} */}
      {/*         /> */}
      {/*       </TouchableOpacity> */}
      {/*     ), */}
      {/*     headerLeft: () => ( */}
      {/*       <TouchableOpacity onPress={() => navigation.navigate("Chat")}> */}
      {/*         <Ionicons */}
      {/*           name="chatbubble-ellipses-outline" */}
      {/*           size={30} */}
      {/*           color="black" */}
      {/*           style={{ marginLeft: 15 }} */}
      {/*         /> */}
      {/*       </TouchableOpacity> */}
      {/*     ), */}
      {/*   })} */}
      {/* /> */}
      <Stack.Screen
        name="Account"
        component={AccountScreen}
        options={{ title: "Account" }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
