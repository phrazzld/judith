import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export const MessageInput = ({
  onSubmit,
}: {
  onSubmit: (text: string) => void;
}) => {
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (inputText.trim().length === 0) return;
    onSubmit(inputText.trim());
    setInputText("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingBottom: 8,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <TextInput
          style={{
            borderRadius: 20,
            borderColor: "#ddd",
            borderWidth: 1,
            paddingHorizontal: 12,
            paddingVertical: 8,
            marginRight: 8,
            maxHeight: 100,
            flex: 0.85,
          }}
          onChangeText={(text) => setInputText(text)}
          value={inputText}
          placeholder="Type a message..."
          multiline
          numberOfLines={4}
          maxLength={1000}
          textAlignVertical="top"
          scrollEnabled
        />
        <TouchableOpacity
          style={{
            backgroundColor: "#2196f3",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            flex: 0.15,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={handleSend}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
            }}
          >
            Send
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
