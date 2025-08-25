
import { Post, Sentiment } from '../types';

const authors = [
  '@TechGuru_Alex', '@CreativeCat', '@DataDan', '@ReactFanatic',
  '@JS_Wizard', '@CSS_Queen', '@UX_Pro', '@DevRel_Diaries',
  '@CodeNewbie', '@Cloud_Savvy'
];

const postTemplates = [
  (hashtag: string) => `Just deployed a new feature using ${hashtag}! The DX is amazing. Feeling productive today. #coding #webdev`,
  (hashtag: string) => `I'm struggling a bit with the new update for ${hashtag}. Any tips from the community? #help #programming`,
  (hashtag: string) => `Watching the keynote for ${hashtag} Conf right now. So many exciting announcements! #tech #innovation`,
  (hashtag: string) => `What are your thoughts on the performance of ${hashtag}? I think it's pretty solid.`,
  (hashtag: string) => `This is a game-changer! ${hashtag} has completely transformed my workflow. Highly recommended! #productivity`,
  (hashtag: string) => `Ugh, another bug... Spent all day debugging this issue related to ${hashtag}. So frustrating. #developerlife`,
  (hashtag: string) => `Just read an interesting article about the future of ${hashtag}. It's going to be interesting to see where it goes.`,
  (hashtag: string) => `To all my followers, check out this awesome library for ${hashtag}. It saved me hours of work! #opensource`,
  (hashtag: string) => `I'm not sure how I feel about the recent changes to ${hashtag}. It feels a bit clunky now.`,
  (hashtag:string) => `The community around ${hashtag} is simply the best. So supportive and helpful! ❤️ #community #tech`
];

const getRandomElement = <T,>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const generateMockPost = (hashtag: string): Post => {
  const author = getRandomElement(authors);
  const content = getRandomElement(postTemplates)(hashtag);

  return {
    id: `post_${Date.now()}_${Math.random()}`,
    author,
    content,
    timestamp: new Date(),
    sentiment: Sentiment.ANALYZING,
  };
};
