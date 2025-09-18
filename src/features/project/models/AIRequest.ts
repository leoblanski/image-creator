import { PresetId } from '../../../core/presets';
import { TrendingTopic } from '../trendingService';

export type AIRequest = {
  category: string;
  goal: string;
  audience: string;
  tone: string;
  language: 'pt-BR' | 'en-US';
  slidesCount: number;
  keyPoints: string[];
  cta?: string;
  hashtags?: string[];
  presetId: PresetId;
  selectedTopic?: TrendingTopic | null;
};

export const createAIRequest = (
  category: string,
  goal: string,
  audience: string,
  tone: string,
  language: 'pt-BR' | 'en-US',
  slidesCount: number,
  keyPoints: string[],
  presetId: PresetId = 'classic_black',
  cta?: string,
  hashtags?: string[],
  selectedTopic?: TrendingTopic | null
): AIRequest => ({
  category,
  goal,
  audience,
  tone,
  language,
  slidesCount,
  keyPoints,
  presetId,
  cta,
  hashtags,
  selectedTopic,
});
