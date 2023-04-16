import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "judith/colors";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const PulsatingCircle = ({
  status,
  size,
  duration,
  delay,
  color,
}: {
  status: string;
  size: number;
  duration: number;
  delay: number;
  color: string;
}) => {
  const progress = new Animated.Value(0);

  useEffect(() => {
    const animations = {
      Listening: () =>
        Animated.loop(
          Animated.timing(progress, {
            toValue: 1,
            duration,
            easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
            useNativeDriver: true,
          })
        ),
      Processing: () =>
        Animated.loop(
          Animated.timing(progress, {
            toValue: 1,
            duration: duration * 2,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ),
      Speaking: () =>
        Animated.loop(
          Animated.timing(progress, {
            toValue: 1,
            duration: duration / 2,
            easing: Easing.bezier(0.42, 0, 0.58, 1),
            useNativeDriver: true,
          })
        ),
    };

    if (status !== "Idle") {
      setTimeout(() => {
        const animation = animations[status]();
        animation.start();
        return () => animation.stop();
      }, delay);
    } else {
      progress.setValue(0);
    }
  }, [status]);

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, status === "Processing" ? 1.1 : 1.5],
  });

  const opacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", status === "Processing" ? "360deg" : "0deg"],
  });

  const animatedStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: color,
    position: "absolute",
    transform: [{ scale }, { rotate }],
    opacity,
  };

  return <Animated.View style={animatedStyle} />;
};

const Visualization = ({ status }: { status: string }) => {
  const circles = [
    { size: 150, duration: 2500, delay: 0, color: "#F44336" },
    { size: 200, duration: 3000, delay: 500, color: "#03A9F4" },
    { size: 250, duration: 3500, delay: 1000, color: "#8BC34A" },
    { size: 300, duration: 4000, delay: 1500, color: "#FF9800" },
  ];

  const textScale = new Animated.Value(1);

  useEffect(() => {
    if (status === "Listening") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(textScale, {
            toValue: 1.1,
            duration: 500,
            easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
            useNativeDriver: true,
          }),
          Animated.timing(textScale, {
            toValue: 1,
            duration: 500,
            easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      textScale.setValue(1);
    }
  }, [status]);

  const animatedTextStyle = {
    fontSize: 24,
    fontWeight: "bold",
    transform: [{ scale: textScale }],
  };

  return (
    <View style={styles.visualization}>
      {circles.map((circle, index) => (
        <PulsatingCircle
          key={index}
          status={status}
          size={circle.size}
          duration={circle.duration}
          delay={circle.delay}
          color={circle.color}
        />
      ))}
      <Animated.Text style={animatedTextStyle}>{status}</Animated.Text>
    </View>
  );
};

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
