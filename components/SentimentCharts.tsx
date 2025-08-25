
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { SentimentStats } from '../types';
import { ChartPieIcon, ChartBarIcon } from './icons';

interface SentimentChartsProps {
  sentimentStats: SentimentStats;
}

const COLORS = {
  positive: '#22c55e', // green-500
  negative: '#ef4444', // red-500
  neutral: '#6b7280',  // gray-500
};

const SentimentCharts: React.FC<SentimentChartsProps> = ({ sentimentStats }) => {
  const pieData = [
    { name: 'Positive', value: sentimentStats.positive },
    { name: 'Negative', value: sentimentStats.negative },
    { name: 'Neutral', value: sentimentStats.neutral },
  ].filter(entry => entry.value > 0);

  const total = sentimentStats.positive + sentimentStats.negative + sentimentStats.neutral;

  return (
    <div className="space-y-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center text-gray-200">
                <ChartPieIcon />
                <span className="ml-2">Sentiment Distribution</span>
            </h2>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    {total === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <p>No data to display yet.</p>
                        </div>
                    ) : (
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(31, 41, 55, 0.8)', // bg-gray-800 with opacity
                                    borderColor: '#4b5563', // gray-600
                                    borderRadius: '0.5rem'
                                }}
                            />
                            <Legend />
                        </PieChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center text-gray-200">
                <ChartBarIcon />
                <span className="ml-2">Total Counts</span>
            </h2>
            <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                   {total === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <p>No data to display yet.</p>
                        </div>
                    ) : (
                    <BarChart data={pieData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                        <XAxis type="number" stroke="#9ca3af" />
                        <YAxis type="category" dataKey="name" stroke="#9ca3af" />
                        <Tooltip
                             contentStyle={{
                                background: 'rgba(31, 41, 55, 0.8)',
                                borderColor: '#4b5563',
                                borderRadius: '0.5rem'
                            }}
                            cursor={{ fill: 'rgba(75, 85, 99, 0.3)' }}
                        />
                        <Bar dataKey="value" barSize={20}>
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
                            ))}
                        </Bar>
                    </BarChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    </div>
  );
};

export default SentimentCharts;
