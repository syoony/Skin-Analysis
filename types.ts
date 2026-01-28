
export type SkinType = 'Dry' | 'Oily' | 'Combination' | 'Sensitive' | 'Normal';

export interface SkinAnalysisMetrics {
  hydration: number;
  oiliness: number;
  troubles: number; // 0 (none) to 100 (severe)
  pigmentation: number;
  pores: number;
  wrinkles: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  ingredients: string[];
  imageUrl: string;
  matchReason: string;
}

export interface AnalysisResult {
  overallScore: number;
  skinType: SkinType;
  metrics: SkinAnalysisMetrics;
  expertCommentary: string;
  recommendedIngredients: string[];
  suggestedRoutine: {
    morning: string[];
    evening: string[];
  };
}

export type AppState = 'HOME' | 'CAPTURE' | 'ANALYZING' | 'RESULT';
