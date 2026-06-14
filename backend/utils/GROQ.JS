import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const getGROQ = async (message) => {
  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
  });
  return response.choices[0].message.content;
};

export default getGROQ;
