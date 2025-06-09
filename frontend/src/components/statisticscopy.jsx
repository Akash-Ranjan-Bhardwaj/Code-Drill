import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar,
  Legend
} from 'recharts';
import { BarChart3, Loader2, Trophy, Target, TrendingUp, Award } from 'lucide-react';

const StatisticsSection = ({ totalCorrect = 45, totalWrong = 12 }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockStats = {
      total: 57,
      difficulty: { EASY: 25, MEDIUM: 22, HARD: 10 },
      tags: {
        'Array': 15,
        'String': 12,
        'Dynamic Programming': 8,
        'Tree': 7,
        'Graph': 6,
        'Sorting': 5,
        'Math': 4
      }
    };
    setStats(mockStats);
  }, []);

  // Color schemes
  const difficultyColors = {
    EASY: '#10b981',
    MEDIUM: '#f59e0b',
    HARD: '#ef4444'
  };

  const tagColors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'];
  
  const accuracyColor = totalCorrect > totalWrong ? '#10b981' : '#f59e0b';
  const accuracyPercentage = Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100);

  // Data transformations
  const difficultyData = stats
    ? Object.entries(stats.difficulty).map(([key, value]) => ({
        name: key,
        count: value,
        fill: difficultyColors[key] || '#6b7280'
      }))
    : [];

  const tagData = stats
    ? Object.entries(stats.tags)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 6)
        .map(([key, value], index) => ({
          name: key,
          count: value,
          fill: tagColors[index] || '#6b7280'
        }))
    : [];

  const accuracyData = [
    { 
      name: 'Accuracy', 
      value: accuracyPercentage,
      fill: accuracyColor
    }
  ];

  const submissionData = [
    { name: 'Correct', count: totalCorrect, fill: '#10b981' },
    { name: 'Wrong', count: totalWrong, fill: '#ef4444' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 rounded-lg shadow-xl border border-gray-600">
          <p className="font-semibold text-white">{label}</p>
          <p className="text-blue-400">
            Count: <span className="font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => {
    const colorClasses = {
      blue: "bg-blue-900/50 text-blue-400 border-blue-700",
      green: "bg-green-900/50 text-green-400 border-green-700",
      yellow: "bg-yellow-900/50 text-yellow-400 border-yellow-700",
      purple: "bg-purple-900/50 text-purple-400 border-purple-700"
    };

    return (
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:shadow-xl hover:border-gray-600 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-2xl space-y-8 border border-gray-700">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
          <BarChart3 className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">Performance Analytics</h2>
          <p className="text-gray-300">Track your coding journey and progress</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="animate-spin w-8 h-8 text-blue-400 mr-3" />
          <span className="text-xl text-gray-300">Loading your statistics...</span>
        </div>
      ) : stats ? (
        <>
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              icon={Trophy}
              title="Problems Solved"
              value={stats.total}
              subtitle="Keep going!"
              color="blue"
            />
            <StatCard 
              icon={Target}
              title="Accuracy Rate"
              value={`${accuracyPercentage}%`}
              subtitle={`${totalCorrect} correct, ${totalWrong} wrong`}
              color="green"
            />
            <StatCard 
              icon={Award}
              title="Hard Problems"
              value={stats.difficulty.HARD}
              subtitle="Challenge accepted"
              color="purple"
            />
            <StatCard 
              icon={TrendingUp}
              title="Favorite Topic"
              value={Object.entries(stats.tags)[0]?.[0] || 'N/A'}
              subtitle={`${Object.entries(stats.tags)[0]?.[1] || 0} problems`}
              color="yellow"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Difficulty Distribution - Pie Chart */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-6 bg-gradient-to-b from-green-400 to-red-400 rounded-full"></div>
                Difficulty Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={difficultyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {difficultyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)',
                      color: '#f9fafb'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-sm font-medium text-gray-300">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Accuracy Gauge */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-6 h-2 bg-gradient-to-r from-red-400 to-green-400 rounded-full"></div>
                Success Rate
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="90%" data={accuracyData}>
                  <RadialBar
                    minAngle={15}
                    label={{ position: 'insideStart', fill: '#fff', fontSize: 16, fontWeight: 'bold' }}
                    background={{ fill: '#374151' }}
                    clockWise
                    dataKey="value"
                  />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-white">
                    {accuracyPercentage}%
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
            </div>

            {/* Topic Distribution - Horizontal Bar */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg"></div>
                Popular Topics
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={tagData} layout="horizontal" margin={{ left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Submission Stats - Area Chart */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg"></div>
                Submission Summary
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={submissionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 14, fontWeight: 500, fill: '#9ca3af' }}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl border border-gray-600">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Keep Up The Great Work! 🎉</h3>
              <p className="text-blue-100 text-lg">
                You've solved {stats.total} problems with a {accuracyPercentage}% accuracy rate.
                {accuracyPercentage >= 80 ? " Outstanding performance! 🌟" : " You're doing great! Keep practicing! 💪"}
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-xl text-gray-300">Unable to load statistics at the moment.</p>
          <p className="text-gray-500">Please try again later.</p>
        </div>
      )}
    </div>
  );
};

export default StatisticsSection;