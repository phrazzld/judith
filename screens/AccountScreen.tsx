import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { deleteUser } from "firebase/auth";
import { COLORS } from "judith/colors";
import { auth } from "judith/firebase";
import { useStore } from "judith/store";
import React from "react";
import {
  Alert,
  Linking,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Snackbar, Switch, Text } from "react-native-paper";

export const PRIVACY_POLICY_URL =
  "https://www.github.com/phrazzld/judith/blob/master/privacy-policy.md";
export const TERMS_OF_SERVICE_URL =
  "https://www.github.com/phrazzld/judith/blob/master/terms-of-service.md";

const AccountScreen = () => {
  const navigation = useNavigation<any>();
  const { error, setError, useAudio, setUseAudio } = useStore();

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
            try {
              const user = auth.currentUser;
              if (!user) {
                throw new Error("User not found");
              }

              await deleteUser(user);
              navigation.navigate("Auth");
            } catch (err: any) {
              console.error(err);
              setError(err.message);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonsContainer}>
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
        <View style={styles.audioToggle}>
          <Text style={styles.audioToggleText}>Audio Responses</Text>
          <Switch
            value={useAudio}
            onValueChange={(value) => setUseAudio(value)}
          />
        </View>
      </View>
      <Policies />
      <Snackbar
        visible={Boolean(error)}
        onDismiss={() => setError(null)}
        action={{
          label: "Dismiss",
          onPress: () => setError(null),
        }}
      >
        {error}
      </Snackbar>
    </SafeAreaView>
  );
};

const Policies = () => {
  const { mindReading, setMindReading } = useStore();

  const goToPrivacyPolicy = () => {
    Linking.openURL(PRIVACY_POLICY_URL);
  };

  const goToTermsOfService = () => {
    Linking.openURL(TERMS_OF_SERVICE_URL);
  };

  return (
    <View style={styles.policies}>
      <TouchableOpacity
        style={styles.policyLinkContainer}
        onPress={goToPrivacyPolicy}
        onLongPress={() => setMindReading(!mindReading)}
      >
        <FontAwesome5
          name={mindReading ? "unlock" : "lock"}
          size={20}
          color={COLORS.black}
          style={styles.policyIcon}
        />
        <Text style={styles.policyLink}>Privacy Policy</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.policyLinkContainer}
        onPress={goToTermsOfService}
      >
        <FontAwesome5
          name="file-alt"
          size={20}
          color={COLORS.black}
          style={styles.policyIcon}
        />
        <Text style={styles.policyLink}>Terms of Service</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  button: {
    width: "80%",
    marginBottom: 10,
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  policies: {
    flex: 1,
    padding: 24,
    justifyContent: "flex-end",
  },
  policyLinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  policyIcon: {
    width: 24,
    textAlign: "center",
  },
  policyLink: {
    fontSize: 14,
    marginLeft: 8,
    color: COLORS.black,
  },
  audioToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 10,
    marginBottom: 10,
  },
  audioToggleText: {
    fontSize: 16,
  },
});

export default AccountScreen;
