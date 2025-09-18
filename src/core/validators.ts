import { BODY_MAX_LENGTH, MAX_SLIDES, MIN_SLIDES, TITLE_MAX_LENGTH } from './sizes';

export const validateTitle = (title: string): boolean => {
  return title.length > 0 && title.length <= TITLE_MAX_LENGTH;
};

export const validateBody = (body: string): boolean => {
  return body.length <= BODY_MAX_LENGTH;
};

export const validateSlideCount = (count: number): boolean => {
  return count >= MIN_SLIDES && count <= MAX_SLIDES;
};

export const validateImageUri = (uri: string): boolean => {
  return uri.length > 0 && (uri.startsWith('file://') || uri.startsWith('content://') || uri.startsWith('http'));
};

export const validateProject = (project: { slides: any[] }): boolean => {
  return validateSlideCount(project.slides.length) && 
         project.slides.every(slide => validateImageUri(slide.backgroundUri));
};
