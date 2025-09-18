import Constants from 'expo-constants';
import { AIRequest } from './models/AIRequest';
import { AIResponse, createFallbackResponse, validateAIResponse } from './models/AIResponse';
import { buildFullPrompt } from './prompt';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini';

export const generateCarousel = async (request: AIRequest): Promise<AIResponse> => {
  const apiKey = Constants.expoConfig?.extra?.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const { system, user } = buildFullPrompt(request);

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 1000,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const parsedContent = JSON.parse(content);
    
    console.log('OpenAI Response:', JSON.stringify(parsedContent, null, 2));
    
    if (!validateAIResponse(parsedContent)) {
      console.error('Invalid response format:', parsedContent);
      // Try to fix common issues
      if (!parsedContent.slides || !Array.isArray(parsedContent.slides)) {
        console.log('Fixing missing slides array');
        parsedContent.slides = [];
      }
      
      // Fix missing index properties
      if (parsedContent.slides && Array.isArray(parsedContent.slides)) {
        parsedContent.slides = parsedContent.slides.map((slide: any, index: number) => ({
          ...slide,
          index: slide.index || index + 1,
        }));
      }
      
      // If we still can't validate, use fallback
      if (!validateAIResponse(parsedContent)) {
        console.log('Using fallback response due to validation failure');
        return createFallbackResponse(request.slidesCount);
      }
    }

    // Validate that we got the right number of slides
    if (parsedContent.slides.length !== request.slidesCount) {
      console.warn(`Expected ${request.slidesCount} slides, got ${parsedContent.slides.length}`);
      // Adjust the response to match expected count
      if (parsedContent.slides.length < request.slidesCount) {
        // Add placeholder slides
        for (let i = parsedContent.slides.length; i < request.slidesCount; i++) {
          parsedContent.slides.push({
            index: i + 1,
            title: `Slide ${i + 1}`,
            body: i === 0 ? 'Engaging content' : undefined,
          });
        }
      } else {
        // Remove excess slides
        parsedContent.slides = parsedContent.slides.slice(0, request.slidesCount);
      }
    }

    return parsedContent as AIResponse;

  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Return fallback response on error
    return createFallbackResponse(request.slidesCount);
  }
};

export const testOpenAIConnection = async (): Promise<boolean> => {
  const apiKey = Constants.expoConfig?.extra?.OPENAI_API_KEY;
  
  if (!apiKey) {
    return false;
  }

  try {
    const testRequest: AIRequest = {
      category: 'Test',
      goal: 'Test',
      audience: 'Test',
      tone: 'casual',
      language: 'en-US',
      slidesCount: 2,
      keyPoints: ['Test point'],
      presetId: 'classic_black',
    };

    await generateCarousel(testRequest);
    return true;
  } catch (error) {
    console.error('OpenAI connection test failed:', error);
    return false;
  }
};
