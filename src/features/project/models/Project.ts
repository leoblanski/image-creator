import { PresetId } from '../../../core/presets';
import { Slide } from './Slide';

export type Project = {
  id: string;
  createdAt: string;
  slides: Slide[];
  language: 'pt-BR' | 'en-US';
  presetId: PresetId;
  name?: string;
  category?: string;
  goal?: string;
  audience?: string;
  tone?: string;
  keyPoints?: string[];
  cta?: string;
  hashtags?: string[];
};

export const createProject = (
  id: string,
  slides: Slide[],
  language: 'pt-BR' | 'en-US' = 'en-US',
  presetId: PresetId = 'classic_black'
): Project => ({
  id,
  createdAt: new Date().toISOString(),
  slides,
  language,
  presetId,
});

export const addSlide = (project: Project, slide: Slide): Project => ({
  ...project,
  slides: [...project.slides, slide],
});

export const updateSlide = (project: Project, slideId: string, updatedSlide: Slide): Project => ({
  ...project,
  slides: project.slides.map(slide => slide.id === slideId ? updatedSlide : slide),
});

export const removeSlide = (project: Project, slideId: string): Project => ({
  ...project,
  slides: project.slides.filter(slide => slide.id !== slideId),
});

export const reorderSlides = (project: Project, slideIds: string[]): Project => {
  const slidesMap = new Map(project.slides.map(slide => [slide.id, slide]));
  const reorderedSlides = slideIds
    .map((id, index) => {
      const slide = slidesMap.get(id);
      return slide ? { ...slide, index } : null;
    })
    .filter((slide): slide is Slide => slide !== null);
  
  return {
    ...project,
    slides: reorderedSlides,
  };
};

export const updateProjectMetadata = (
  project: Project,
  metadata: Partial<Pick<Project, 'name' | 'category' | 'goal' | 'audience' | 'tone' | 'keyPoints' | 'cta' | 'hashtags'>>
): Project => ({
  ...project,
  ...metadata,
});
