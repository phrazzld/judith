import { useEffect, useRef } from "react";
import { ScrollView } from "react-native";

export const useScrollToEnd = (deps: any[]) => {
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    return () => clearTimeout(timer);
  }, deps);

  return scrollViewRef;
};
