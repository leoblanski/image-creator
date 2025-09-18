import { PresetId } from '../../../core/presets';

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
  hashtags?: string[]
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
});
