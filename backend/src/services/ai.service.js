import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";
import { ChatMistralAI } from "@langchain/mistralai";
import { createAgent, tool } from "langchain";
import * as z from "zod";
import { webSearch } from "./webSearch.js";
import { sendEmail } from "./email.service.js";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
  temperature: 0,
});

const groqModel = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0,
  streaming: true, 
});

const webSearchTool = tool(webSearch, {
  name: "webSearchTool",
  description: `
You are an internet search tool.

Always use this tool whenever answering the user's question requires current, real-time, or external information.

Examples:
- "Who won yesterday's IPL match?"
- "Latest AI news"
- "Weather in Mumbai"
- "React 20 release date"
- "Bitcoin price"


Do not call this tool multiple times for the same question
Return the most relevant web search results for the given query.
`,
  schema: z.object({
    query: z.string().describe("The search query"),
  }),
});

const emailTool = tool(sendEmail, {
  name : "emailTool",
  description : "This tool is used to send emails.",
  schema : z.object({
    to : z.string().describe("Email address of the recipient"),
    subject : z.string().describe("Subject of the email"),
    html : z.string().describe("HTML content of the email"),
  })
})

const agent = createAgent({
  model: groqModel,
  tools: [webSearchTool, emailTool],
  systemPrompt: `You are a helpful research assistant.

Rules for tool use:
- You may call webSearchTool AT MOST ONCE per user question.
- After you get search results back, you MUST immediately write a final text answer using those results. Do not call webSearchTool again, even if the results seem incomplete.
- Only call emailTool if the user explicitly asks you to send an email.
- Never call the same tool twice in a row.`,
});

export async function generateResponse(allMessages) {
  const messages = allMessages.map((msg) =>
    msg.role === "user"
      ? new HumanMessage(msg.content)
      : new AIMessage(msg.content),
  );

  const response = await agent.invoke(
    { messages },
    { recursionLimit: 10 } // give it room for one full search+answer cycle
  );

  return response.messages[response.messages.length - 1].content;
}

export async function generateChatTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(`
You are a helpful assistant that generates concise and descriptive titles for chat conversations.

The user will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2–4 words.

Rules:
- Title should be 2–4 words.
- Do not use quotes.
- Do not add punctuation.
- Return only the title.
    `),

    new HumanMessage(`
Generate a title for a chat conversation based on the following first message:

 ${message}
    `),
  ]);

  return response.content.trim();
}

export async function streamResponse(messages, onToken) {
  const langchainMessages = Array.isArray(messages)
    ? messages
        .filter(m => m.content && typeof m.content === "string" && m.content.trim() !== "")
        .map(m =>
          m.role === "user"
            ? new HumanMessage(m.content)
            : new AIMessage(m.content)
        )
    : [new HumanMessage(messages)]; // normal single message still works ✅

  const events = agent.streamEvents(
    { messages: langchainMessages },
    { version: "v2" }
  );

  let fullAnswer = "";
  for await (const event of events) {
    if (event.event === "on_chat_model_stream") {
      const content = event.data?.chunk?.content;
      if (content) {
        fullAnswer += content;
        onToken(content);
      }
    }
  }
  return fullAnswer;
}