
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCaseScenario = async (category: string) => {
  const prompt = `Generate a legal case scenario based on ${category} (Indian context, Tamil Nadu specific if possible). 
  Return as JSON with title, brief, facts (array), and parties.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          brief: { type: Type.STRING },
          facts: { type: Type.ARRAY, items: { type: Type.STRING } },
          parties: {
            type: Type.OBJECT,
            properties: {
              petitioner: { type: Type.STRING },
              respondent: { type: Type.STRING }
            }
          }
        },
        required: ['title', 'brief', 'facts', 'parties']
      }
    }
  });
  
  return JSON.parse(response.text);
};

export const getCourtroomInteraction = async (
  role: string, 
  caseBrief: string, 
  userAction: string,
  history: {role: string, content: string}[]
) => {
  const prompt = `You are an AI Virtual Judge/Opposing Counsel in a Tamil Nadu mock court. 
  Case: ${caseBrief}
  User Role: ${role}
  User Input: ${userAction}
  
  Evaluate their legal reasoning, citation of sections (IPC/CrPC/CPC/Constitution), and courtroom etiquette. 
  Provide a dynamic response that either accepts the argument, raises an objection, or asks a clarifying question.
  Also provide a "legal_score" from 0-10 for this turn.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          response: { type: Type.STRING },
          legal_score: { type: Type.NUMBER },
          feedback: { type: Type.STRING }
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateLegalQuiz = async (topic: string) => {
  const prompt = `Generate 5 high-quality legal MCQ questions for Tamil Nadu law students on ${topic}. 
  Include detailed explanations in English and a short summary in Tamil.
  Return as an array of JSON objects.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.NUMBER },
            explanation: { type: Type.STRING },
            tamilExplanation: { type: Type.STRING },
            lawSection: { type: Type.STRING }
          }
        }
      }
    }
  });

  return JSON.parse(response.text);
};
