import { API_URL } from "judith/constants";
import { createMessage, getMessages } from "judith/firebase";
import { ChatMessage, GPTChatMessage } from "judith/types";
import { countWords } from "judith/utils";
import { useEffect, useState } from "react";

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

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

      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: "user",
        text: inputText.trim(),
      };

      const contextMessages = prepareContextMessages(messages, inputText);

      createMessage(newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      await sendBotMessage(contextMessages, setMessages);
    } catch (error: any) {
      console.error(error);
    }
  };

  return { messages, sendMessage };
};

const prepareContextMessages = (
  messages: ChatMessage[],
  inputText: string
): GPTChatMessage[] => {
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

  contextMessages.push({
    role: "user",
    content: inputText.trim(),
  });

  return contextMessages;
};

const sendBotMessage = async (
  contextMessages: GPTChatMessage[],
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages: contextMessages }),
  });
  const { response: botResponse } = await response.json();

  const botMessage: ChatMessage = {
    id: Date.now().toString(),
    sender: "bot",
    text: botResponse,
  };

  createMessage(botMessage);
  setMessages((prevMessages) => [...prevMessages, botMessage]);
};
