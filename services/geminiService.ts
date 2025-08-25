import { GoogleGenAI, Type } from "@google/genai";
import { Post, Sentiment } from '../types';

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export interface SentimentAnalysisResult {
  id: string;
  sentiment: string;
}

export const analyzeSentimentBatch = async (posts: Post[], apiKey: string): Promise<SentimentAnalysisResult[]> => {
  if (posts.length === 0) {
    return [];
  }
  
  if (!apiKey) {
    console.error("Gemini API key is not provided.");
    return posts.map(p => ({ id: p.id, sentiment: Sentiment.NEUTRAL }));
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const postsToAnalyze = posts.map(p => ({ id: p.id, content: p.content }));

    const prompt = `Analyze the sentiment of the following social media posts. Classify each as POSITIVE, NEGATIVE, or NEUTRAL.
    Respond with a valid JSON array where each object has an "id" (the post ID) and a "sentiment" (the classification as an uppercase string).

    Example Response:
    [
      {"id": "post_123", "sentiment": "POSITIVE"},
      {"id": "post_456", "sentiment": "NEGATIVE"}
    ]

    Posts to analyze:
    ${JSON.stringify(postsToAnalyze)}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.1,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              sentiment: { type: Type.STRING },
            },
            required: ['id', 'sentiment'],
          },
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      console.warn("Gemini API returned no text for batch. Defaulting all to NEUTRAL.");
      return posts.map(p => ({ id: p.id, sentiment: Sentiment.NEUTRAL }));
    }

    const results: SentimentAnalysisResult[] = JSON.parse(resultText);
    return results;

  } catch (error: any) {
    console.error("Error analyzing batch sentiment with Gemini API:", error);
    const errorMessage = error.toString();
    if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
      throw new RateLimitError('API rate limit exceeded. Please wait and try again.');
    }
    // Fallback on other errors: return all posts in the batch as neutral.
    return posts.map(p => ({ id: p.id, sentiment: Sentiment.NEUTRAL }));
  }
};