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
  const tipsCount = slidesCount - 2; // Minus hook and CTA
  const slides = Array.from({ length: slidesCount }, (_, index) => {
    if (index === 0) {
      return {
        index: index + 1,
        title: `${tipsCount} dicas para sucesso`,
        body: 'Conteúdo interessante aqui',
      };
    } else if (index === slidesCount - 1) {
      return {
        index: index + 1,
        title: 'Siga para mais dicas',
        body: undefined,
      };
    } else {
      const tipNumber = index;
      return {
        index: index + 1,
        title: `Dica ${tipNumber}`,
        body: `Conteúdo da dica ${tipNumber}`,
      };
    }
  });

  return {
    slides,
    cta: 'Siga para mais dicas',
  };
};
