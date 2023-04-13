import { API_URL } from "judith/constants";
import { createMessage, getMessages } from "judith/firebase";
import { GPTChatMessage, TMessage } from "judith/types";
import { countWords } from "judith/utils";
import { useEffect, useState } from "react";

export const useChat = () => {
  const [messages, setMessages] = useState<TMessage[]>([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const messages = await getMessages();
      setMessages(messages);
    } catch (error: any) {
      console.error(error);
    }
  };

  const sendMessage = async (inputText: string) => {
    try {
      if (inputText.trim().length === 0) return;

      const newMessage: TMessage = {
        id: Date.now().toString(),
        sender: "user",
        text: inputText.trim(),
      };

      // Helper function to count words in a string

      const reversedMessages = [...messages].reverse();
      let contextMessages: GPTChatMessage[] = [];
      let totalWords = countWords(inputText.trim());

      for (const message of reversedMessages) {
        const messageContent: GPTChatMessage = {
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
    } catch (error: any) {
      console.error(error);
    }
  };

  return { messages, sendMessage };
};
