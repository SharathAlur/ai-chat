export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  status?: "streaming" | "done" | "error";
}
