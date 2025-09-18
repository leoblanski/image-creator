export type AISlide = {
  index: number;
  title: string;
  body?: string;
};

export type AIResponse = {
  slides: AISlide[];
  cta?: string;
  hashtags?: string[];
};

export const validateAIResponse = (response: any): response is AIResponse => {
  return (
    response &&
    typeof response === 'object' &&
    Array.isArray(response.slides) &&
    response.slides.every((slide: any) => 
      typeof slide === 'object' &&
      typeof slide.index === 'number' &&
      typeof slide.title === 'string' &&
      (slide.body === undefined || typeof slide.body === 'string')
    ) &&
    (response.cta === undefined || typeof response.cta === 'string') &&
    (response.hashtags === undefined || Array.isArray(response.hashtags))
  );
};

export const createFallbackResponse = (slidesCount: number): AIResponse => {
  const slides = Array.from({ length: slidesCount }, (_, index) => ({
    index: index + 1,
    title: `Slide ${index + 1}`,
    body: index === 0 ? 'Engaging content goes here' : undefined,
  }));

  return {
    slides,
    cta: 'Follow for more content',
  };
};
