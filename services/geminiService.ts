
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";
import { Language } from "../translations";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.NUMBER, description: "A health score from 0 to 100" },
    skinType: { type: Type.STRING, description: "One of: Dry, Oily, Combination, Sensitive, Normal" },
    metrics: {
      type: Type.OBJECT,
      properties: {
        hydration: { type: Type.NUMBER },
        oiliness: { type: Type.NUMBER },
        troubles: { type: Type.NUMBER },
        pigmentation: { type: Type.NUMBER },
        pores: { type: Type.NUMBER },
        wrinkles: { type: Type.NUMBER }
      },
      required: ["hydration", "oiliness", "troubles", "pigmentation", "pores", "wrinkles"]
    },
    expertCommentary: { type: Type.STRING, description: "A friendly, professional summary of the skin condition." },
    recommendedIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
    suggestedRoutine: {
      type: Type.OBJECT,
      properties: {
        morning: { type: Type.ARRAY, items: { type: Type.STRING } },
        evening: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["morning", "evening"]
    }
  },
  required: ["overallScore", "skinType", "metrics", "expertCommentary", "recommendedIngredients", "suggestedRoutine"]
};

export const analyzeSkinImage = async (base64Image: string, lang: Language): Promise<AnalysisResult> => {
  const model = "gemini-3-flash-preview";
  
  const imagePart = {
    inlineData: {
      mimeType: "image/jpeg",
      data: base64Image.split(",")[1] || base64Image,
    },
  };

  const langInstruction = lang === 'ko' 
    ? "모든 텍스트 응답(전문가 코멘트, 추천 성분, 루틴 단계)은 반드시 한국어로 작성하세요." 
    : "Write all text responses (expert commentary, recommended ingredients, routine steps) in English.";

  const prompt = `Act as a world-class dermatologist. ${langInstruction}
  Analyze the provided facial photo for skin health.
  Assess the following categories: hydration, oil balance, acne/troubles, pigmentation/spots, pore size, and wrinkles.
  Provide numeric scores (0-100) where higher hydration is good, but higher troubles/wrinkles is bad.
  Determine the skin type (Dry, Oily, Combination, Sensitive, Normal). Offer expert advice and recommend key ingredients (e.g., Hyaluronic Acid, Salicylic Acid, Niacinamide).`;

  const response = await ai.models.generateContent({
    model,
    contents: { parts: [imagePart, { text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA,
    },
  });

  const text = response.text;
  if (!text) throw new Error("Failed to get analysis result from AI");
  
  return JSON.parse(text) as AnalysisResult;
};
