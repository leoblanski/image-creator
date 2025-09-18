import { PresetId } from '../../../core/presets';

export type Slide = {
  id: string;
  index: number;
  backgroundUri: string;
  textTitle?: string;
  textBody?: string;
  styleId: PresetId;
};

export const createSlide = (
  id: string,
  index: number,
  backgroundUri: string,
  styleId: PresetId = 'classic_black'
): Slide => ({
  id,
  index,
  backgroundUri,
  styleId,
});

export const updateSlideText = (
  slide: Slide,
  textTitle?: string,
  textBody?: string
): Slide => ({
  ...slide,
  textTitle,
  textBody,
});

export const updateSlideStyle = (slide: Slide, styleId: PresetId): Slide => ({
  ...slide,
  styleId,
});
