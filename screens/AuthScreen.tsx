import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  linkWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
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
      <SafeAreaView>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View>
            <View>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                testID="EmailInput"
              />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                returnKeyType="done"
                autoCapitalize="none"
                testID="PasswordInput"
                secureTextEntry
              />
            </View>
            <View>
              <TouchableOpacity onPress={signUp} disabled={loading}>
                <Text>Sign Up</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={signIn} disabled={loading}>
                <Text>Log In</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                onPress={handlePasswordReset}
                disabled={loading}
              >
                <Text>Forgot password?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default AuthScreen;
