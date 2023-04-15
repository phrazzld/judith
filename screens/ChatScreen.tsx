import { COLORS } from "judith/colors";
import { useChat } from "judith/hooks/useChat";
import { useScrollToEnd } from "judith/hooks/useScrollToEnd";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { Button, Text } from "react-native-paper";

// TODO: Scroll to end when text input is selected
// TODO: Disable send button while waiting for a response
const ChatScreen = () => {
  const { messages, sendMessage } = useChat();
  const scrollViewRef = useScrollToEnd([messages]);
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (inputText.trim().length === 0) return;
    sendMessage(inputText.trim());
    setInputText("");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          style={{ backgroundColor: COLORS.white }}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={{
                backgroundColor:
                  message.sender === "bot" ? COLORS.lightGray : COLORS.primary,
                borderRadius: 5,
                padding: 10,
                margin: 10,
                maxWidth: "80%",
                alignSelf: message.sender === "bot" ? "flex-start" : "flex-end",
              }}
            >
              <Text>{message.text}</Text>
            </View>
          ))}
        </ScrollView>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            justifyContent: "space-between",
          }}
        >
          <TextInput
            style={{
              backgroundColor: COLORS.lightGray,
              borderRadius: 5,
              padding: 10,
              flex: 1,
              marginRight: 10,
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
          <Button
            onPress={handleSend}
            mode="contained"
            disabled={inputText.trim().length === 0}
            style={{ backgroundColor: COLORS.primary }}
          >
            <Text style={{ fontWeight: "500" }}>Send</Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
