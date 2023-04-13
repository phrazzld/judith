import { useScrollToEnd } from "judith/hooks/useScrollToEnd";
import { ChatMessage } from "judith/types";
import React from "react";
import { ScrollView, Text, View } from "react-native";

export const MessageList = ({ messages }: { messages: ChatMessage[] }) => {
  const scrollViewRef = useScrollToEnd([messages]);

  return (
    <ScrollView
      ref={scrollViewRef}
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16 }}
    >
      {messages.map((message) => (
        <View
          key={message.id}
          style={[
            {
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 8,
              marginBottom: 12,
              maxWidth: "80%",
            },
            message.sender === "bot"
              ? { alignSelf: "flex-start", backgroundColor: "#e0e0e0" }
              : { alignSelf: "flex-end", backgroundColor: "#2196f3" },
          ]}
        >
          <Text
            style={[
              { fontSize: 16 },
              message.sender === "bot" ? { color: "#000" } : { color: "#fff" },
            ]}
          >
            {message.text}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};
