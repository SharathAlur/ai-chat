import { useState, type ReactNode } from "react";
import { type Message } from "./types";
import { readTextStream } from "./helpers/readTextStream";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const bubbleClass =
    "max-w-[80%] rounded-2xl px-4 py-2 leading-relaxed whitespace-pre-wrap wrap-break-word";
  const assistantClass = `${bubbleClass} self-start rounded-bl-sm bg-gray-100 dark:bg-gray-800`;
  const userClass = `${bubbleClass} self-end rounded-br-sm bg-blue-600 text-white`;

  const addAssistantResponse = async (history: Message[]) => {
    // const response = `this is the thing you typed.. ${userInput}. it will be processed.`;
    const id = crypto.randomUUID();
    setIsStreaming(true);

    try {
      setMessages((prev) => [...prev, { id, content: "", role: "assistant" }]);

      const res = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          messages: history.map(({ content, role }) => ({
            content,
            role,
          })),
        }),
      });
      if (!res.ok) {
        throw new Error(`request failed with ${res.status}`);
      }
      if (!res.ok) throw new Error(`request failed with ${res.status}`);

      let content = "";
      for await (const stream of readTextStream(res)) {
        console.log(stream);
        content += stream;

        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, content } : m)),
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStreaming) return;
    const text = input.trim();
    if (!text) {
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: text,
      role: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    addAssistantResponse([...messages, userMessage]);

    setInput("");
  };

  const addMessages = (): ReactNode => (
    <div className="flex flex-col gap-3">
      {messages.map((message) => {
        const cls = message.role === "user" ? userClass : assistantClass;
        return (
          <div className={cls} key={message.id}>
            {message.content || "Thinking..."}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="flex h-svh flex-col p-4 sm:p-6">
      <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
        <header className="border-b border-gray-200 px-5 py-3 font-semibold dark:border-gray-800">
          AI Chat
        </header>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-gray-400">
              Enter message to start chatting
            </div>
          ) : (
            addMessages()
          )}
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-2 border-t border-gray-200 p-3 dark:border-gray-800"
        >
          <textarea
            id="userInput"
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                !e.nativeEvent.isComposing
              ) {
                e.preventDefault(); // don't insert a newline
                e.currentTarget.form?.requestSubmit(); // fires the form's onSubmit
              }
            }}
            onChange={(e) => setInput(e.target.value)}
            value={input}
            rows={1}
            placeholder="Type a message… (Shift+Enter for a new line)"
            className="field-sizing-content max-h-40 min-h-11 flex-1 resize-none rounded-xl border border-gray-300 bg-transparent px-4 py-2.5 text-base placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-700"
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="h-11 shrink-0 rounded-xl bg-blue-600 px-5 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
