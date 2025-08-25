
import React from 'react';
import { Post, Sentiment } from '../types';
import Spinner from './Spinner';

interface PostCardProps {
  post: Post;
}

const sentimentStyles = {
  [Sentiment.POSITIVE]: {
    borderColor: 'border-green-500',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-400',
    dotColor: 'bg-green-500',
  },
  [Sentiment.NEGATIVE]: {
    borderColor: 'border-red-500',
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-400',
    dotColor: 'bg-red-500',
  },
  [Sentiment.NEUTRAL]: {
    borderColor: 'border-gray-500',
    bgColor: 'bg-gray-500/10',
    textColor: 'text-gray-400',
    dotColor: 'bg-gray-500',
  },
  [Sentiment.ANALYZING]: {
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    dotColor: 'bg-blue-500',
  },
};

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const styles = sentimentStyles[post.sentiment];

  const timeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 5) return "just now";
    return `${seconds}s ago`;
  };

  return (
    <div className={`p-4 mb-4 rounded-lg border-l-4 transition-all duration-300 ${styles.borderColor} ${styles.bgColor}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-indigo-400">{post.author}</p>
          <p className="text-gray-300 mt-1">{post.content}</p>
        </div>
        <div className="flex-shrink-0 ml-4 text-right">
            <div className={`flex items-center justify-end space-x-2 text-sm ${styles.textColor}`}>
                {post.sentiment === Sentiment.ANALYZING ? (
                    <>
                        <Spinner />
                        <span>Analyzing...</span>
                    </>
                ) : (
                    <>
                        <div className={`w-2 h-2 rounded-full ${styles.dotColor}`}></div>
                        <span>{post.sentiment}</span>
                    </>
                )}
            </div>
            <p className="text-xs text-gray-500 mt-1">{timeAgo(post.timestamp)}</p>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
