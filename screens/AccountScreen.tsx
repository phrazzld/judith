import { useNavigation } from "@react-navigation/native";
import { deleteUser } from "firebase/auth";
import { auth } from "judith/firebase";
import React from "react";
import { Alert, SafeAreaView, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";

const AccountScreen = () => {
  const navigation = useNavigation<any>();

  const handleLogout = () => {
    auth.signOut();
    navigation.navigate("Auth");
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const user = auth.currentUser;
            if (!user) {
              throw new Error("User not found");
            }

            await deleteUser(user);
            navigation.navigate("Auth");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Account</Text>
      <Button mode="outlined" style={styles.button} onPress={handleLogout}>
        Log Out
      </Button>
      <Button
        mode="outlined"
        style={styles.button}
        onPress={handleDeleteAccount}
      >
        Delete Account
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    width: "80%",
    marginBottom: 10,
  },
});

export default AccountScreen;
