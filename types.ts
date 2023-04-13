export type TMessage = {
  id: string;
  sender: "user" | "bot";
  text: string;
};

export type NewMessage = {
  sender: "user" | "bot";
  text: string;
};

export type GPTChatMessage = {
  role: "assistant" | "user";
  content: string;
}
