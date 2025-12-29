
import { GoogleGenAI, Type } from "@google/genai";
import { ProfileAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const validateTikTokProfileImage = async (imageBase64: string): Promise<boolean> => {
  const prompt = "Analise esta imagem. Ela é obrigatoriamente um print de um perfil do TikTok? Responda JSON: { \"isValid\": boolean }.";
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [{ text: prompt }, { inlineData: { mimeType: 'image/png', data: imageBase64.split(',')[1] } }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: { isValid: { type: Type.BOOLEAN } },
          required: ["isValid"]
        }
      }
    });
    const result = JSON.parse(response.text || '{"isValid": false}');
    return result.isValid;
  } catch (error) {
    return false;
  }
};

export const analyzeProfileAndQuiz = async (quizData: Record<number, string[]>, imageBase64?: string): Promise<ProfileAnalysis> => {
  const prompt = `Analise as respostas do quiz e o print do perfil para um mentor de TikTok Shop.
    Quiz: ${Object.entries(quizData).map(([id, answers]) => `Q${id}: ${answers.join(', ')}`).join('\n')}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: imageBase64 
      ? { parts: [{ text: prompt }, { inlineData: { mimeType: 'image/png', data: imageBase64.split(',')[1] } }] }
      : prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          strategicActionPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
          viralPotential: { type: Type.STRING }
        },
        required: ["score", "strengths", "weaknesses", "strategicActionPlan", "viralPotential"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as ProfileAnalysis;
};

export const getMentorResponse = async (message: string, context: ProfileAnalysis, chatHistory: {role: 'user' | 'model', content: string}[]) => {
  // Using gemini-3-flash-preview for maximum speed as requested
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `Você é o Shop Mentor AI. Mentor rígido e ultra veloz. 
      Responda rápido, direto e com foco em faturamento.
      REGRAS: 1. Use emojis 📈. 2. SEM negrito (**) ou markdown. 3. Máximo 150 palavras.
      Obrigatório terminar com: [SUGESTÕES: Pergunta 1 | Pergunta 2 | Pergunta 3].
      Contexto: ${JSON.stringify(context)}`
    }
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};

/**
 * Simulates calling TikTok Display API (video.list) to check for recent activity.
 */
export const verifyTikTokActivity = async (accessToken: string): Promise<boolean> => {
  // Simulating network latency and API check
  await new Promise(resolve => setTimeout(resolve, 1500));
  // Logic: Success 80% of the time for the mock
  return Math.random() > 0.2;
};
