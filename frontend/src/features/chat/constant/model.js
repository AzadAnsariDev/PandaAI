import { Sparkles, Zap, Wind } from "lucide-react";

export const MODELS = [
  { id: "gemini", name: "Gemini 2.5 Flash", provider: "Google", icon: Sparkles, bg: "bg-gradient-to-br from-blue-500 to-purple-500", glow: "99, 102, 241" },
  { id: "llama", name: "Llama 3.3 70B", provider: "Groq", icon: Zap, bg: "bg-gradient-to-br from-orange-500 to-amber-500", glow: "249, 115, 22" },
  { id: "mistral", name: "Mistral Small", provider: "Mistral AI", icon: Wind, bg: "bg-gradient-to-br from-orange-600 to-red-500", glow: "255, 112, 0" },
];