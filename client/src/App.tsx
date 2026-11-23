import { useState, type ReactNode } from "react";
import "./App.css";
import { type Message } from "./types";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const systemClass = "text-left mr-10 p-2 wrap-break-word whitespace-pre-wrap";
  const userClass =
    "text-right  ml-10 bg-gray-100 p-2 rounded wrap-break-word whitespace-pre-wrap";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const msg = input;
    // TODO 1: trim the input; if it's empty, stop here
    if (!input.trim()) {
      return;
    }

    // TODO 2: build a userMessage object of type Message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: input.trim(),
      role: "user",
    };

    // TODO 3: add it to messages
    setMessages((prev) => [...prev, userMessage]);

    // TODO 4: clear the input
    setInput("");
    setTimeout(() => {
      // TODO 5: build an assistant message: "You said: <text>"
      const mess = `this is the thing you typed.. ${msg}. it will be processed.`;
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: mess,
        role: "assistant",
      };

      // TODO 6: add it to messages
      setMessages((prev) => [...prev, assistantMessage]);
    }, 500);
  }

  const addMessages = (): ReactNode => (
    <div className="flex flex-col gap-2">
      {messages.map((message) => {
        const cls = message.role === "user" ? userClass : systemClass;
        return (
          <p className={cls} key={message.id}>
            {message.content}
          </p>
        );
      })}
    </div>
  );

  return (
    <div id="center" className="shadow-md m-10 p-5">
      <div className="h-full p-5 border rounded-md border-blue-100 flex flex-col gap-5 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-screen">
            Enter message to start chatting
          </div>
        ) : (
          addMessages()
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="h-20 mt-10">
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
            className="border"
          />
        </div>
      </form>
    </div>
  );
}

export default App;
