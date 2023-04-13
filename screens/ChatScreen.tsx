import { createMessage, getMessages } from "judith/firebase";
import { countWords } from "judith/utils";
import React, { useEffect, useRef, useState } from "react";
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
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    return () => clearTimeout(timer);
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const messages = await getMessages();
      setMessages(messages);
    } catch (error: any) {
      console.error(error);
    }
  };

  const sendMessage = async () => {
    try {
      if (inputText.trim().length === 0) return;

      const newMessage: TMessage = {
        id: Date.now().toString(),
        sender: "user",
        text: inputText.trim(),
      };

      // Helper function to count words in a string

      const reversedMessages = [...messages].reverse();
      let contextMessages: { role: "assistant" | "user"; content: string }[] =
        [];
      let totalWords = countWords(inputText.trim());

      for (const message of reversedMessages) {
        const messageContent: { role: "assistant" | "user"; content: string } =
          {
            role: message.sender === "bot" ? "assistant" : "user",
            content: message.text,
          };
        const messageWords = countWords(message.text);

        if (totalWords + messageWords > 1000) break;

        totalWords += messageWords;
        contextMessages.unshift(messageContent);
      }

      // Add the new user message to the context
      contextMessages.push({
        role: "user",
        content: inputText.trim(),
      });

      createMessage(newMessage);

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputText("");
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: contextMessages }),
      });
      const { response: botResponse } = await response.json();

      const botMessage: TMessage = {
        id: Date.now().toString(),
        sender: "bot",
        text: botResponse,
      };

      createMessage(botMessage);

      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
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
    paddingBottom: 20,
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
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginRight: 8,
    marginBottom: 8,
    maxHeight: 100,
    backgroundColor: "#fff",
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
