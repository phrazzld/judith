// Common properties for a Judith chat message
export type MessageBase = {
  sender: "user" | "bot";
  text: string;
};

// A Judith chat message
export type ChatMessage = MessageBase & {
  id: string;
  note?: string;
}

// Message format for the GPT Chat API
export type GPTChatMessage = {
  role: "assistant" | "user";
  content: string;
}
