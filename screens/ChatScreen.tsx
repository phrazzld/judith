import { COLORS } from "judith/colors";
import { useChat } from "judith/hooks/useChat";
import { useScrollToEnd } from "judith/hooks/useScrollToEnd";
import { useStore } from "judith/store";
import { ChatMessage } from "judith/types";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TextInput,
  View,
} from "react-native";
import { ActivityIndicator, Button, Snackbar, Text } from "react-native-paper";

const MessageComponent = React.memo(({ message }: { message: ChatMessage }) => {
  const { mindReading } = useStore();

  if (message.id === "sending") {
    return (
      <View
        key={"sending"}
        style={{
          backgroundColor: COLORS.lightGray,
          borderRadius: 10,
          padding: 10,
          margin: 10,
          maxWidth: "80%",
          alignSelf: "flex-start",
        }}
      >
        <ActivityIndicator animating={true} color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View
      key={message.id}
      style={{
        display:
          !mindReading && message.note === "reflection" ? "none" : "flex",
        backgroundColor:
          message.sender === "bot" ? COLORS.lightGray : COLORS.primary,
        borderWidth: message.note === "reflection" ? 1 : 0,
        borderStyle: message.note === "reflection" ? "dashed" : "solid",
        borderRadius: 10,
        padding: 10,
        margin: 10,
        maxWidth: "80%",
        alignSelf: message.sender === "bot" ? "flex-start" : "flex-end",
      }}
    >
      <Text>{message.text}</Text>
      <Text style={{ paddingTop: 10, fontSize: 10, color: COLORS.darkGray }}>
        {message.createdAt
          ? new Date(message.createdAt.toDate()).toLocaleString()
          : ""}
      </Text>
    </View>
  );
});

// TODO: Add scroll to top and scroll to bottom buttons
const ChatScreen = () => {
  const { messages, sendMessage, isSending, fetchMoreMessages, loadingMore } =
    useChat();
  const { scrollViewRef, scrollToEnd } = useScrollToEnd(messages);
  const [inputText, setInputText] = useState("");
  const { error, setError } = useStore();

  const handleSend = () => {
    if (inputText.trim().length === 0) return;
    sendMessage(inputText.trim());
    setInputText("");
  };

  const renderItem = useCallback(
    ({ item: message }: { item: ChatMessage }) => (
      <MessageComponent message={message} />
    ),
    []
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={{ flex: 1 }}
      >
        {messages.length > 0 && (
          <FlatList
            ref={scrollViewRef}
            data={
              isSending
                ? [
                    ...messages,
                    { id: "sending", sender: "bot", text: "loading" },
                  ]
                : messages
            }
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={{ backgroundColor: COLORS.white }}
            onContentSizeChange={() => scrollToEnd()}
            onLayout={() => scrollToEnd()}
            initialNumToRender={10}
            onRefresh={fetchMoreMessages}
            refreshing={loadingMore}
          />
        )}
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
              borderRadius: 10,
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
            onFocus={() => {
              setTimeout(() => {
                scrollToEnd();
              }, 100);
            }}
            scrollEnabled
          />
          <Button
            onPress={handleSend}
            mode="contained"
            disabled={inputText.trim().length === 0 || isSending}
          >
            Send
          </Button>
        </View>
      </KeyboardAvoidingView>
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

export default ChatScreen;
