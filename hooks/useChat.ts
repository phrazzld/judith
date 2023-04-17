import { API_URL } from "judith/constants";
import { auth, createMessage, getMessages } from "judith/firebase";
import { useStore } from "judith/store";
import { ChatMessage, GPTChatMessage } from "judith/types";
import { countWords } from "judith/utils";
import { useEffect, useState } from "react";

export const useChat = () => {
  const [loadingMore, setLoadingMore] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { setError } = useStore();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMoreMessages = async () => {
    if (loadingMore || messages.length <= 1) return;

    setLoadingMore(true);
    try {
      const oldestMessage = messages[0];
      const moreMessages = await getMessages(7, oldestMessage.createdAt);
      if (moreMessages.length > 0) {
        setMessages((prevMessages) => [...moreMessages, ...prevMessages]);
      }
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoadingMore(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const messages = await getMessages();
      if (messages.length > 0) {
        setMessages(messages);
      } else {
        const firstMessage: ChatMessage = {
          id: Date.now().toString(),
          sender: "bot",
          text: "Hi! I'm Judith. How can I help you?",
        };
        createMessage(firstMessage);
        setMessages([firstMessage]);
      }
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    }
  };

  const sendMessage = async (inputText: string) => {
    try {
      if (inputText.trim().length === 0) return;
      setIsSending(true);

      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: "user",
        text: inputText.trim(),
      };

      const contextMessages = prepareContextMessages(
        messages.filter((message) => message.note !== "reflection"),
        inputText
      );

      createMessage(newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      await sendBotMessage(contextMessages, setMessages);
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    } finally {
      setIsSending(false);
    }
  };

  return { messages, sendMessage, isSending, fetchMoreMessages, loadingMore };
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
  try {
    if (!auth.currentUser) {
      console.error("User not logged in");
      return;
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: auth.currentUser.uid,
        messages: contextMessages,
      }),
    });
    const { response: botResponse } = await response.json();

    const botMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "bot",
      text: botResponse,
    };

    await createMessage(botMessage);
    const messages = await getMessages();
    setMessages(messages);
  } catch (err: any) {
    console.error(err);
    throw new Error(err.message);
  }
};
