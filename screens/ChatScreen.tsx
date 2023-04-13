import { MessageInput } from "judith/components/MessageInput";
import { MessageList } from "judith/components/MessageList";
import { useChat } from "judith/hooks/useChat";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const ChatScreen = () => {
  const { messages, sendMessage } = useChat();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <MessageList messages={messages} />
      <MessageInput onSubmit={sendMessage} />
    </SafeAreaView>
  );
};

export default ChatScreen;
