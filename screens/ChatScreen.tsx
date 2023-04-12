import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL =
  "https://us-central1-judith-beck.cloudfunctions.net/getResponseToMessage";

type TMessage = {
  id: string;
  sender: "bot" | "user";
  text: string;
};

const ChatScreen = () => {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [inputText, setInputText] = useState("");

  const sendMessage = async () => {
    try {
      if (inputText.trim().length === 0) return;

      const newMessage: TMessage = {
        id: Date.now().toString(),
        sender: "user",
        text: inputText.trim(),
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputText("");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: newMessage.text }),
      });
      console.log("response", response);
      const { response: botResponse } = await response.json();
      console.log("botResponse", botResponse);

      const botMessage: TMessage = {
        id: Date.now().toString(),
        sender: "bot",
        text: botResponse,
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.message,
              message.sender === "bot" ? styles.botMessage : styles.userMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                message.sender === "bot"
                  ? styles.botMessageText
                  : styles.userMessageText,
              ]}
            >
              {message.text}
            </Text>
          </View>
        ))}
      </ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          onChangeText={(text) => setInputText(text)}
          value={inputText}
          placeholder="Type a message..."
          multiline
          numberOfLines={4}
          maxLength={1000}
          textAlignVertical="top"
          scrollEnabled
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  chatContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  message: {
    borderRadius: 12,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxWidth: "70%",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e1e1e1",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
  },
  messageText: {
    fontSize: 16,
  },
  botMessageText: {
    color: "#000",
  },
  userMessageText: {
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#e1e1e1",
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
