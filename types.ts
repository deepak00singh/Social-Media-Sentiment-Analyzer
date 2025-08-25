
export enum Sentiment {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
  NEUTRAL = 'NEUTRAL',
  ANALYZING = 'ANALYZING',
}

export interface Post {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  sentiment: Sentiment;
}

export interface SentimentStats {
  positive: number;
  negative: number;
  neutral: number;
}
