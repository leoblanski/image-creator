import { AIRequest } from './models/AIRequest';

const SYSTEM_PROMPT = `You are a social media copywriter for Instagram carousels. Write concise, high-converting copy for each slide. Titles <= 6 words. Bodies optional, <= 20 words. 

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

IMPORTANT: Each slide MUST have an "index" property starting from 1.

Guidelines:
- Slide 1 must be a strong hook/CTA that introduces the topic
- Create a logical sequence where each slide builds on the previous one
- Use numbered lists when appropriate (ex: "3 dicas para quem está começando")
- The "body" field is for additional context/description that won't appear on the image but helps understand the content
- Keep copy scannable; no paragraphs
- Avoid emojis unless highly relevant
- Match the tone and audience specified
- Ensure each slide flows naturally to the next
- Focus on engagement and value delivery
- Return ONLY the JSON object, no other text

Example structure for numbered content:
- Slide 1: "3 Dicas para Iniciantes" (hook)
- Slide 2: "1 - Faça Projetos Pessoais" (first tip)
- Slide 3: "2 - Pratique Consistência" (second tip)
- Slide 4: "3 - Busque Mentoria" (third tip)`;

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
    hashtags 
  } = request;

  let prompt = `category: ${category}
goal: ${goal}
audience: ${audience}
tone: ${tone}
language: ${language}
slides_count: ${slidesCount}

rules:
 - Slide 1 must be a strong hook/CTA that introduces the topic.
 - Create a logical sequence where each slide builds on the previous one.
 - Use numbered lists when appropriate (ex: "3 dicas para quem está começando").
 - The "body" field is for additional context/description that won't appear on the image.
 - Keep copy scannable; no paragraphs.
 - Avoid emojis unless highly relevant.
 - Ensure smooth flow and continuity between slides.

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
