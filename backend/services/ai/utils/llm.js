import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, "../.env") })
dotenv.config()

import { ChatOpenRouter } from "@langchain/openrouter";

const llm = new ChatOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  model: "deepseek/deepseek-chat",
  temperature: 0,
  maxTokens: 1024,
});

export default llm
