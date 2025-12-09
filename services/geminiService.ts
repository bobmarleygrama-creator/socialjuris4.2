import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini client safely
// Note: In a real production app, ensure your API key is restricted or proxied.
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables. AI features may not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateWelcomeMessage = async (userName: string): Promise<string> => {
  const client = getClient();
  if (!client) {
    return `Olá, ${userName}! Bem-vindo de volta ao sistema.`;
  }

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a short, warm, and professional welcome message for a user named "${userName}" in Portuguese (Brazil). Keep it under 20 words.`,
    });
    
    return response.text || `Olá, ${userName}!`;
  } catch (error) {
    console.error("Error generating welcome message:", error);
    return `Olá, ${userName}! (Erro ao conectar com IA)`;
  }
};