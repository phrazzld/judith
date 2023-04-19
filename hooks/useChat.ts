import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { getDownloadURL, ref } from "firebase/storage";
import { API_URL } from "judith/constants";
import { auth, createMessage, getMessages, storage } from "judith/firebase";
import { useStore } from "judith/store";
import { ChatMessage, GPTChatMessage } from "judith/types";
import { countWords } from "judith/utils";
import { useEffect, useState } from "react";

export const useChat = () => {
  const [loadingMore, setLoadingMore] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { setError, useAudio } = useStore();

  useEffect(() => {
    fetchMessages();
  }, []);

  // Initialize audio mode
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      playThroughEarpieceAndroid: false,
      allowsRecordingIOS: false,
    });
  }, []);

  // Unload sound when unmounting
  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading sound...");
          sound.unloadAsync();
          setIsPlaying(false);
        }
      : undefined;
  }, [sound]);

  const onPlaybackStatusUpdate = (playbackStatus: any) => {
    if (!playbackStatus.isLoaded) {
      // Update your UI for the unloaded state
      if (playbackStatus.error) {
        console.error(
          `Encountered a fatal error during playback: ${playbackStatus.error}`
        );
      }
    } else {
      if (playbackStatus.isPlaying) {
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }

      // TODO: Properly handle buffering state
      if (playbackStatus.isBuffering) {
        //console.log("Buffering...");
      }

      // TODO: Figure out why we have to manually setSound etc
      //       stopSound doesn't do the trick because sound is null
      //       but playingFilename isn't? Weird
      if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
        console.log("Finished playing");
        setSound(null);
        setIsPlaying(false);
      }
    }
  };

  async function playSound(fileToPlay: string | null = null): Promise<void> {
    console.log("Playing sound...");
    try {
      if (sound && fileToPlay !== null) {
        console.error("Cannot play sound, another sound is already playing");
        return;
      }

      if (sound && fileToPlay === null) {
        console.log("Sound is loaded, resuming...");
        sound.playAsync();
      } else {
        if (!fileToPlay) {
          console.error("Cannot play sound, no filename is set");
          return;
        }

        console.log("Sound is not loaded, loading...");
        const filename = ref(storage, fileToPlay);
        const uri = await getDownloadURL(filename);
        const { sound: playbackObject } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true }
        );
        setSound(playbackObject);
        // Call stopSound when audio finishes playing
        playbackObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      }
    } catch (err: any) {
      console.warn("Error playing sound:");
      console.error(err);
      setError(err.message);
    }
  }

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

      const audioUrl = await sendBotMessage(
        contextMessages,
        setMessages,
        useAudio
      );

      if (audioUrl) {
        playSound(audioUrl);
      }
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
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  useAudio: boolean
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
        useAudio,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(error);
      throw new Error(error.message);
    }

    const { audioUrl } = await response.json();
    const messages = await getMessages();
    setMessages(messages);
    return audioUrl;
  } catch (err: any) {
    console.error(err);
    throw new Error(err.message);
  }
};
