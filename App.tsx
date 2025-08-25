import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Post, Sentiment, SentimentStats } from './types';
import { analyzeSentimentBatch, RateLimitError } from './services/geminiService';
import { generateMockPost } from './services/mockPostService';
import ControlPanel from './components/ControlPanel';
import Dashboard from './components/Dashboard';
import { BrandIcon } from './components/icons';
import ApiKeyModal from './components/ApiKeyModal';

const MAX_POSTS = 50;
const POST_GENERATION_INTERVAL = 5000; // Generate a post every 5s
const ANALYSIS_BATCH_INTERVAL = 10000; // Analyze posts in a batch every 10s

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [hashtag, setHashtag] = useState<string>('#ReactDevs');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sentimentStats, setSentimentStats] = useState<SentimentStats>({
    positive: 0,
    negative: 0,
    neutral: 0,
  });
  const [analysisQueue, setAnalysisQueue] = useState<Post[]>([]);

  const streamIntervalRef = useRef<number | null>(null);
  const analysisIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Check session storage for API key on initial load
    const storedApiKey = sessionStorage.getItem('geminiApiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleApiKeySubmit = (key: string) => {
    if (key) {
      setApiKey(key);
      sessionStorage.setItem('geminiApiKey', key);
    }
  };

  const processQueue = useCallback(() => {
    if (!apiKey) return;

    setAnalysisQueue(currentQueue => {
      if (currentQueue.length === 0) {
        return [];
      }

      const batchToAnalyze = [...currentQueue];
      
      (async () => {
        try {
          const results = await analyzeSentimentBatch(batchToAnalyze, apiKey);

          const resultMap = new Map<string, Sentiment>();
          results.forEach(res => {
            const validSentiments = [Sentiment.POSITIVE, Sentiment.NEGATIVE, Sentiment.NEUTRAL];
            const sentiment = validSentiments.includes(res.sentiment as Sentiment)
              ? res.sentiment as Sentiment
              : Sentiment.NEUTRAL;
            resultMap.set(res.id, sentiment);
          });
          
          batchToAnalyze.forEach(post => {
            if (!resultMap.has(post.id)) {
              resultMap.set(post.id, Sentiment.NEUTRAL);
            }
          });

          const statsUpdate: SentimentStats = { positive: 0, negative: 0, neutral: 0 };
          resultMap.forEach((sentiment) => {
            if (sentiment !== Sentiment.ANALYZING) {
                statsUpdate[sentiment.toLowerCase() as keyof SentimentStats]++;
            }
          });

          setPosts(prevPosts =>
            prevPosts.map(p =>
              resultMap.has(p.id) ? { ...p, sentiment: resultMap.get(p.id)! } : p
            )
          );

          setSentimentStats(prevStats => ({
            positive: prevStats.positive + statsUpdate.positive,
            negative: prevStats.negative + statsUpdate.negative,
            neutral: prevStats.neutral + statsUpdate.neutral,
          }));

        } catch (e) {
          console.error('Failed to analyze sentiment batch:', e);
          if (e instanceof RateLimitError) {
            setError('API rate limit reached. Stream stopped. Please wait a moment before starting again.');
            setIsStreaming(false);
          }
          setPosts(prevPosts =>
            prevPosts.map(p =>
              batchToAnalyze.some(b => b.id === p.id) ? { ...p, sentiment: Sentiment.NEUTRAL } : p
            )
          );
          setSentimentStats(prevStats => ({
            ...prevStats,
            neutral: prevStats.neutral + batchToAnalyze.length,
          }));
        }
      })();
      
      return [];
    });
  }, [apiKey]); 

  useEffect(() => {
    if (isStreaming && apiKey) {
      streamIntervalRef.current = window.setInterval(() => {
        if (!hashtag.trim()) return;
        const newPost = generateMockPost(hashtag);
        setPosts(prevPosts => [newPost, ...prevPosts.slice(0, MAX_POSTS - 1)]);
        setAnalysisQueue(prevQueue => [...prevQueue, newPost]);
      }, POST_GENERATION_INTERVAL);

      analysisIntervalRef.current = window.setInterval(processQueue, ANALYSIS_BATCH_INTERVAL);
    } else {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
      if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
      streamIntervalRef.current = null;
      analysisIntervalRef.current = null;
      processQueue();
    }

    return () => {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
      if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
    };
  }, [isStreaming, hashtag, apiKey, processQueue]);

  const handleStart = () => {
    if (!hashtag.trim()) {
      setError("Please enter a hashtag to start streaming.");
      return;
    }
    setError(null);
    setPosts([]);
    setAnalysisQueue([]);
    setSentimentStats({ positive: 0, negative: 0, neutral: 0 });
    setIsStreaming(true);
  };

  const handleStop = () => {
    setIsStreaming(false);
  };

  if (!apiKey) {
    return <ApiKeyModal onApiKeySubmit={handleApiKeySubmit} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <BrandIcon />
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Social Sentiment Analyzer
            </h1>
          </div>
        </header>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <main className="flex flex-col space-y-6">
          <ControlPanel
            hashtag={hashtag}
            setHashtag={setHashtag}
            isStreaming={isStreaming}
            onStart={handleStart}
            onStop={handleStop}
          />
          <Dashboard posts={posts} sentimentStats={sentimentStats} />
        </main>
      </div>
    </div>
  );
};

export default App;