import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY
});

export async function testAi(){
    const response = await model.invoke("who is virat kohli? Tell in 50 words")
    console.log(response.content)
} 
