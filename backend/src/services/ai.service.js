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


const modelMap = {
  gemini: geminiModel,
  llama: groqModel,
  mistral: mistralModel,
};

async function normalizeImageUrl(imageUrl) {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("data:")) return imageUrl;

  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image from ${imageUrl}: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const contentType = response.headers.get("content-type") || "image/png";
  const base64 = buffer.toString("base64");

  return `data:${contentType};base64,${base64}`;
}



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

export async function streamResponse(messages, model, imageUrl, onToken) {
  const finalModel = imageUrl ? "gemini" : model; // 👈 yahi pressure/force hai
  const selectedModel = modelMap[finalModel] || groqModel;

  console.log(selectedModel)
  const agent = createAgent({
    model: selectedModel,
    tools: [webSearchTool, emailTool],
    systemPrompt: `You are a helpful research assistant.

Rules for tool use:
- You may call webSearchTool AT MOST ONCE per user question.
- After you get search results back, you MUST immediately write a final text answer using those results. Do not call webSearchTool again, even if the results seem incomplete.
- Only call emailTool if the user explicitly asks you to send an email.
- Never call the same tool twice in a row.`,
  });

  // Step 1: purani history ko LangChain messages mein convert karo
  const langchainMessages = Array.isArray(messages)
    ? messages
        .filter(m => m.content && typeof m.content === "string" && m.content.trim() !== "")
        .map(m =>
          m.role === "user"
            ? new HumanMessage(m.content)
            : new AIMessage(m.content)
        )
    : [new HumanMessage(messages)]; // agar single string aaya toh

  // Step 2: agar image hai, toh sabse last message (jo abhi ka user input hai)
  // ko replace karo multi-modal content ke saath
  if (imageUrl && langchainMessages.length > 0) {
    const normalizedImageUrl = await normalizeImageUrl(imageUrl);
    const lastIndex = langchainMessages.length - 1;
    const lastMsg = langchainMessages[lastIndex];
    const textContent = typeof lastMsg.content === "string" ? lastMsg.content : "";

    langchainMessages[lastIndex] = new HumanMessage({
      content: [
        { type: "text", text: textContent },
        { type: "image_url", image_url: { url: normalizedImageUrl } },
      ],
    });
  }

  // Step 3: poori history bhejo, sirf last message nahi
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

export async function streamCompareResponse(messages, onToken) {
  // modelMap ki saari keys le lo: gemini, llama, mistral
  const modelKeys = Object.keys(modelMap);

  const langchainMessages = Array.isArray(messages)
    ? messages
        .filter(m => m.content && typeof m.content === "string" && m.content.trim() !== "")
        .map(m =>
          m.role === "user"
            ? new HumanMessage(m.content)
            : new AIMessage(m.content)
        )
    : [new HumanMessage(messages)];

  // Har model ke liye alag agent banao aur parallel stream karo
  const streamPromises = modelKeys.map(async (modelKey) => {
    try {
      const agent = createAgent({
        model: modelMap[modelKey],
        tools: [webSearchTool, emailTool],
        systemPrompt: `You are a helpful research assistant.

Rules for tool use:
- You may call webSearchTool AT MOST ONCE per user question.
- After you get search results back, you MUST immediately write a final text answer using those results.
- Only call emailTool if the user explicitly asks you to send an email.
- Never call the same tool twice in a row.`,
      });

      const events = agent.streamEvents(
        { messages: langchainMessages },
        { version: "v2" }
      );

      for await (const event of events) {
        if (event.event === "on_chat_model_stream") {
          const content = event.data?.chunk?.content;
          if (content) {
            onToken(modelKey, content); // 👈 model tag ke saath token bhejo
          }
        }
      }

      onToken(modelKey, null, "done"); // is model ka stream khatam
    } catch (err) {
      console.error(`Error in ${modelKey}:`, err.message);
      onToken(modelKey, null, "error", err.message);
    }
  });

  // allSettled — koi ek model fail ho to baaki chalte rahein
  return await Promise.allSettled(streamPromises);
}