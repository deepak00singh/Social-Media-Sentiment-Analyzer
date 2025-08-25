
import React from 'react';
import { Post } from '../types';
import PostCard from './PostCard';
import { RssIcon } from './icons';

interface PostFeedProps {
  posts: Post[];
}

const PostFeed: React.FC<PostFeedProps> = ({ posts }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg h-[70vh] flex flex-col">
      <h2 className="text-xl font-bold mb-4 flex items-center text-gray-200">
        <RssIcon />
        <span className="ml-2">Live Feed</span>
      </h2>
      {posts.length === 0 ? (
        <div className="flex-grow flex items-center justify-center text-gray-500">
          <p>Waiting for posts... Start streaming to see the live feed.</p>
        </div>
      ) : (
        <div className="overflow-y-auto pr-2 flex-grow">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
        </div>
      )}
    </div>
  );
};

export default PostFeed;
