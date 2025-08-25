
import React from 'react';
import { Post, SentimentStats } from '../types';
import PostFeed from './PostFeed';
import SentimentCharts from './SentimentCharts';

interface DashboardProps {
  posts: Post[];
  sentimentStats: SentimentStats;
}

const Dashboard: React.FC<DashboardProps> = ({ posts, sentimentStats }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <PostFeed posts={posts} />
      </div>
      <div>
        <SentimentCharts sentimentStats={sentimentStats} />
      </div>
    </div>
  );
};

export default Dashboard;
