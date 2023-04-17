import { ChatMessage } from "judith/types";
import { useCallback, useEffect, useRef } from "react";
import { FlatList } from "react-native";

export const useScrollToEnd = (messages: ChatMessage[]) => {
  const scrollViewRef = useRef<FlatList>(null);

  const scrollToEnd = useCallback(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToEnd();
    }, 200);

    return () => clearTimeout(timer);
  }, [messages, scrollToEnd]);

  return { scrollViewRef, scrollToEnd };
};
