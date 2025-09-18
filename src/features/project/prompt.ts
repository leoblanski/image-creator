import { AIRequest } from './models/AIRequest';

const SYSTEM_PROMPT = `You are an expert Instagram carousel copywriter who creates viral, high-engagement content. Your goal is to maximize engagement, saves, and follows.

CRITICAL REQUIREMENTS:
- Write compelling, curiosity-driven titles that make people stop scrolling
- Use psychological triggers: curiosity gaps, social proof, urgency
- Focus on actionable, valuable content that people want to save
- Create titles that are scroll-stopping and shareable

You MUST return a valid JSON object with this exact structure:
{
  "slides": [
    {"index": 1, "title": "Hook Title", "body": "Optional short line"},
    {"index": 2, "title": "Idea", "body": "Optional detail"},
    {"index": 3, "title": "Another Point", "body": "More details"}
  ],
  "cta": "Follow for more dev tips",
  "hashtags": ["#marketing", "#business"]
}

ENGAGEMENT STRATEGY:
- Slide 1: Hook with curiosity gap ("X secrets that...", "Why most people fail at...")
- Middle slides: Actionable tips with emotional triggers
- Last slide: Strong CTA with social proof

TITLE GUIDELINES:
- 4-6 words maximum for maximum impact
- Use power words: "secret", "proven", "guaranteed", "mistake", "hack"
- Create curiosity: "What nobody tells you about...", "The truth about..."
- Use emotional triggers: "stop doing", "never do", "always do"
- NEVER use numbers or bullet points in titles (no "1 -", "2 -", "3 -", etc.)

TONE & STYLE:
- Conversational and direct
- Use "you" to speak directly to the reader
- Create urgency and FOMO
- Focus on transformation and results
- Match the specified tone and audience

Return ONLY the JSON object, no other text.`;

export const buildUserPrompt = (request: AIRequest): string => {
  const { 
    category, 
    goal, 
    audience, 
    tone, 
    language, 
    slidesCount, 
    keyPoints, 
    cta, 
    hashtags,
    selectedTopic
  } = request;

  let prompt = `category: ${category}
goal: ${goal}
audience: ${audience}
tone: ${tone}
language: ${language}
slides_count: ${slidesCount}`;

  // Add how-to topic context if available
  if (selectedTopic) {
    prompt += `\n\nhow_to_topic: ${selectedTopic.title}
topic_description: ${selectedTopic.description}
topic_tags: [${selectedTopic.tags.join(', ')}]
topic_popularity: ${selectedTopic.popularity}%

FOCUS ON THIS HOW-TO TOPIC:
- Create a step-by-step carousel about "${selectedTopic.title}"
- Use the topic's description and tags for context
- Make it practical and actionable
- Focus on teaching and helping people achieve something
- Create content that solves a real problem people have
- Each slide should be a clear step or tip`;
  }

  prompt += `\n\nHOW-TO CAROUSEL RULES:
 - Slide 1: Create an engaging hook about the problem
   * Use patterns: "How to [achieve something]", "X steps to [goal]", "The complete guide to..."
   * Focus on the outcome people want to achieve
   * ${selectedTopic ? `Make it specifically about "${selectedTopic.title}"` : ''}
 - Middle slides: Clear, actionable steps
   * Each slide should be one specific step or tip
   * Use action words: "Start with", "Next", "Then", "Finally"
   * Make each step easy to follow and implement
   * ${selectedTopic ? `Relate each step to the how-to topic "${selectedTopic.title}"` : ''}
 - Last slide: Strong CTA with next steps
   * "Follow for more [topic] guides", "Save this guide", "Share with someone learning [topic]"
   * ${selectedTopic ? `Reference the how-to topic in the CTA` : ''}
 - NEVER use numbers or bullet points in titles (no "1 -", "2 -", "3 -", etc.)
 - Write clear, helpful titles that teach something
 - The "body" field is for additional context that won't appear on the image
 - Use "you" to speak directly to the reader
 - Focus on teaching and helping, not just information
 - ${selectedTopic ? `Make every slide a step toward achieving "${selectedTopic.title}"` : ''}

key_points: [${keyPoints.map(point => `"${point}"`).join(', ')}]`;

  if (cta) {
    prompt += `\ncta: ${cta}`;
  }

  if (hashtags && hashtags.length > 0) {
    prompt += `\nhashtags_theme: ${hashtags.join(', ')}`;
  }

  return prompt;
};

export const buildFullPrompt = (request: AIRequest): { system: string; user: string } => {
  return {
    system: SYSTEM_PROMPT,
    user: buildUserPrompt(request),
  };
};
