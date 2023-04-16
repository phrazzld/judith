import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "judith/colors";
import { Visualization } from "judith/components/Visualization";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const VoiceChatScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("Idle");

  const startRecording = () => {
    setIsRecording(true);
    setStatus("Listening");
    // TODO: Implement actual recording logic with Whisper
  };

  const stopRecording = () => {
    setIsRecording(false);
    setStatus("Processing");
    // TODO: Send transcript out as a message, autoplay Eleven Labs audio when it comes back
    /* setStatus("Speaking") */
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.tertiary, COLORS.lightGray]}
        style={styles.gradientBackground}
      />
      <Visualization status={status} />
      <TouchableOpacity
        onPressIn={startRecording}
        onPressOut={stopRecording}
        style={styles.recordButton}
      >
        <Ionicons name="mic" size={50} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  visualization: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  status: {
    fontSize: 24,
    fontWeight: "bold",
  },
  recordButton: {
    marginBottom: 30,
    backgroundColor: COLORS.secondary,
    borderRadius: 50,
    padding: 20,
  },
  pulsatingCircle: {
    position: "absolute",
    backgroundColor: COLORS.primary,
  },
  particle: {
    position: "absolute",
    backgroundColor: COLORS.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  gradientBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

export default VoiceChatScreen;
