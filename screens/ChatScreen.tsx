import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "judith/colors";
import { useChat } from "judith/hooks/useChat";
import { useScrollToEnd } from "judith/hooks/useScrollToEnd";
import { useStore } from "judith/store";
import { ChatMessage } from "judith/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator, Button, Snackbar, Text } from "react-native-paper";

interface MessageComponentProps {
  message: ChatMessage;
  onRetry?: (message: ChatMessage) => void;
}

const MessageComponent = React.memo((props: MessageComponentProps) => {
  const { message, onRetry } = props;
  const { mindReading } = useStore();
  const [showRetry, setShowRetry] = useState(false);

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
      style={{
        display: "flex",
        flexDirection: "row",
        alignSelf: message.sender === "bot" ? "flex-start" : "flex-end",
      }}
    >
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
          maxWidth: "70%",
          alignSelf: message.sender === "bot" ? "flex-start" : "flex-end",
          marginRight: showRetry ? 0 : 10,
        }}
      >
        <Text onLongPress={() => setShowRetry(true)}>{message.text}</Text>
        <Text style={{ paddingTop: 10, fontSize: 10, color: COLORS.darkGray }}>
          {message.createdAt
            ? new Date(message.createdAt.toDate()).toLocaleString()
            : ""}
        </Text>
      </View>
      {!!onRetry && showRetry && (
        <Button
          onPress={() => onRetry(message)}
          style={{ alignSelf: "center", margin: 0, padding: 0 }}
        >
          <Ionicons
            name="ios-refresh"
            size={20}
            color={COLORS.secondary}
            style={{ margin: 0, padding: 0 }}
          />
        </Button>
      )}
    </View>
  );
});

// TODO: If isSending is false but the last message is a user message, refetch messages
// TODO: If refetch doesn't get a response, resend the user message and alert the user
const ChatScreen = () => {
  const { messages, sendMessage, isSending, fetchMoreMessages, loadingMore } =
    useChat();
  const { scrollViewRef, scrollToEnd } = useScrollToEnd(messages);
  const [inputText, setInputText] = useState("");
  const { error, setError } = useStore();
  const [inputContainerHeight, setInputContainerHeight] = useState(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const handleRetry = (message: ChatMessage) => {
    sendMessage(message.text);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleSend = () => {
    if (inputText.trim().length === 0) return;
    sendMessage(inputText.trim());
    setInputText("");
  };

  const handleInputContainerLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setInputContainerHeight(height);
  };

  const scrollY = useRef(0);

  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleScroll = (event: any) => {
    const { y } = event.nativeEvent.contentOffset;
    scrollY.current = y;
    // Get the height of the screen
    const screenHeight = event.nativeEvent.layoutMeasurement.height;
    // Get the height of the content
    const contentHeight = event.nativeEvent.contentSize.height;
    // Get the scroll position
    const scrollPosition = y;
    // If the scroll position is at the bottom, then we are at the end
    const isAtBottom = screenHeight + scrollPosition >= contentHeight - 20;
    setShowScrollTop(isAtBottom);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const renderItem = useCallback(
    ({ item: message }: { item: ChatMessage }) => {
      return message.sender === "user" ? (
        <MessageComponent message={message} onRetry={handleRetry} />
      ) : (
        <MessageComponent message={message} />
      );
    },
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
            onScroll={handleScroll}
            scrollEventThrottle={16}
            onContentSizeChange={() => scrollToEnd()}
            onLayout={() => scrollToEnd()}
            initialNumToRender={10}
            onRefresh={fetchMoreMessages}
            refreshing={loadingMore}
          />
        )}
        <View
          onLayout={handleInputContainerLayout}
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
        <TouchableOpacity
          style={{
            position: "absolute",
            right: 10,
            bottom: inputContainerHeight + 10 + keyboardHeight,
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: 25,
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={showScrollTop ? scrollToTop : scrollToEnd}
        >
          <Text style={{ fontSize: 20 }}>{showScrollTop ? "↑" : "↓"}</Text>
        </TouchableOpacity>
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
