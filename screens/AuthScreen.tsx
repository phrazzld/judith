import { useNavigation } from "@react-navigation/native";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { auth } from "../firebase";

const AuthScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<any>();

  const signUp = async (): Promise<void> => {
    try {
      setLoading(true);
      Keyboard.dismiss();
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.navigate("Chat");
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (): Promise<void> => {
    try {
      setLoading(true);
      Keyboard.dismiss();
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("Chat");
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (): Promise<void> => {
    try {
      Keyboard.dismiss();
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", backgroundColor: "#fff" }}
      >
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Image
            source={require("judith/assets/icon.png")}
            resizeMode="contain"
            style={{ width: 200, height: 200, alignSelf: "center" }}
          />
          <View style={{ marginVertical: 10 }}>
            <Text style={{ fontSize: 26 }}>Judith</Text>
          </View>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, paddingHorizontal: 20 }}
        >
          <View>
            <View style={{ marginBottom: 20 }}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                style={{
                  borderWidth: 1,
                  borderColor: "#e1e1e1",
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 10,
                  backgroundColor: "#fff",
                }}
              />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                returnKeyType="done"
                autoCapitalize="none"
                style={{
                  borderWidth: 1,
                  borderColor: "#e1e1e1",
                  borderRadius: 8,
                  padding: 12,
                  backgroundColor: "#fff",
                }}
                secureTextEntry
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <TouchableOpacity
                onPress={signUp}
                disabled={loading}
                style={{
                  backgroundColor: "#007AFF",
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  marginHorizontal: 5,
                }}
              >
                <Text style={{ color: "#fff" }}>Sign Up</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={signIn}
                disabled={loading}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  marginLeft: 5,
                  borderWidth: 1,
                  borderColor: "#007AFF",
                }}
              >
                <Text style={{ color: "#444" }}>Log In</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 20, alignItems: "flex-end" }}>
              <TouchableOpacity
                onPress={handlePasswordReset}
                disabled={loading}
              >
                <Text style={{ color: "#666" }}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default AuthScreen;
