import "dotenv/config";
import express from "express";
import { getProvider } from "./providers/index.js";
import { validateMessages } from "./middlewares/validateMessages.js";

const provider = getProvider(process.env.AI_PROVIDER!);
const app = express();
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.send({ ok: true });
});

app.post("/api/chat", validateMessages, async (req, res) => {
  try {
    const { messages } = req.body;

    const reply = await provider.complete(messages);
    res.json({ reply });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "something went wrong" });
  }
});

app.post("/api/chat/stream", validateMessages, async (req, res) => {
  const controller = new AbortController();
  try {
    const { messages } = req.body;

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");

    res.on("close", () => controller.abort());

    for await (const chunk of provider.stream(messages, controller.signal)) {
      res.write(chunk);
    }
    res.end();
  } catch (e) {
    if (controller.signal.aborted) return;
    if (!res.headersSent) {
      res.status(500).json({ error: "Something went wrong" }); // nothing sent yet → proper error
    } else {
      res.write("\n\n[Error: response interrupted]"); // already streaming → say it in the body
      res.end();
    }
  }
});

app.listen(3001, () => {
  console.log("app is listening");
});
