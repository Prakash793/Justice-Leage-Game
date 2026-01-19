
import { GoogleGenAI, Type } from "@google/genai";
import { OFFLINE_QUIZ, OFFLINE_FEEDBACK } from "../data/localContent";
import { MOCK_CASES } from "../data/mockCases";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const isOnline = () => navigator.onLine;

export const generateCaseScenario = async (category: string) => {
  if (!isOnline()) {
    // Return a random mock case matching the category or just any random one
    const filtered = MOCK_CASES.filter(c => c.category.includes(category) || category.includes(c.category));
    return filtered.length > 0 ? filtered[Math.floor(Math.random() * filtered.length)] : MOCK_CASES[0];
  }

  const prompt = `Generate a legal case scenario based on ${category} (Indian context, Tamil Nadu specific if possible). 
  Return as JSON with title, brief, facts (array), and parties.`;
  
  try {
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
  } catch (e) {
    return MOCK_CASES[0];
  }
};

export const getCourtroomInteraction = async (
  role: string, 
  caseBrief: string, 
  userAction: string,
  history: {role: string, content: string}[]
) => {
  if (!isOnline()) {
    const randomFeedback = OFFLINE_FEEDBACK[Math.floor(Math.random() * OFFLINE_FEEDBACK.length)];
    return {
      response: randomFeedback,
      legal_score: 8,
      feedback: "Operating in local offline mode."
    };
  }

  const prompt = `You are an AI Virtual Judge/Opposing Counsel in a Tamil Nadu mock court. 
  Case: ${caseBrief}
  User Role: ${role}
  User Input: ${userAction}
  Evaluate their legal reasoning. Provide a dynamic response.
  Provide a "legal_score" from 0-10.`;

  try {
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
  } catch (e) {
    return {
      response: "The court acknowledges your submission. (Connection Lost - Fallback activated)",
      legal_score: 5,
      feedback: "Connection error."
    };
  }
};

export const generateLegalQuiz = async (topic: string) => {
  if (!isOnline()) {
    return OFFLINE_QUIZ[topic] || OFFLINE_QUIZ['Constitutional Law'];
  }

  const prompt = `Generate 5 high-quality legal MCQ questions for Tamil Nadu law students on ${topic}. 
  Include detailed explanations in English and a short summary in Tamil.
  Return as an array of JSON objects.`;

  try {
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
  } catch (e) {
    return OFFLINE_QUIZ[topic] || OFFLINE_QUIZ['Constitutional Law'];
  }
};
