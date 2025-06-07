import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../lib/axios.js';
import {
  CheckCircle,
  Clock,
  Tag,
  AlertCircle,
  BookOpen,
  Trophy,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const SolvedProblems = () => {
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSolvedProblems();
  }, []);

  const fetchSolvedProblems = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get('/problems/get-solved-problems');
      if (response.data.success) {
        setSolvedProblems(response.data.problems);
      }
    } catch (err) {
      console.error('Error fetching solved problems:', err);
      setError('Failed to fetch solved problems');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'badge-success';
      case 'medium':
        return 'badge-warning';
      case 'hard':
        return 'badge-error';
      default:
        return 'badge-ghost';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const sortedProblems = [...solvedProblems].sort((a, b) => {
    const aDate = new Date(a.solvedBy?.[0]?.solvedAt || 0);
    const bDate = new Date(b.solvedBy?.[0]?.solvedAt || 0);
    return bDate - aDate;
  });

  const displayedProblems = showAll ? sortedProblems : sortedProblems.slice(0, 2);

  if (loading) {
    return (
      <div className="p-2 md:p-6 card bg-base-100 shadow-xl rounded-2xl mb-12">
        <div className="card-body">
          <div className="flex justify-center items-center p-8">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <span className="ml-4 text-lg text-base-content">Loading solved problems...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-2 md:p-6 card bg-base-100 shadow-xl rounded-2xl mb-12">
        <div className="card-body">
          <div className="alert alert-error">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
            <div>
              <button
                onClick={fetchSolvedProblems}
                className="btn btn-sm btn-outline btn-error"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (solvedProblems.length === 0) {
    return (
      <div className="p-2 md:p-6 card bg-base-100 shadow-xl rounded-2xl mb-12">
        <div className="card-body">
          <div className="flex items-center space-x-4 mb-6">
            <Trophy className="w-10 h-10 text-success" />
            <h2 className="text-3xl font-bold text-base-content">Solved Problems</h2>
          </div>
          <div className="text-center p-16">
            <div className="w-32 h-32 bg-base-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-16 h-16 text-base-content/60" />
            </div>
            <h3 className="text-2xl font-semibold text-base-content mb-3">No Problems Solved Yet</h3>
            <p className="text-base-content/70 text-lg">Start solving problems to see your progress here!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-6 card bg-base-100 shadow-xl rounded-2xl mb-12">
      <div className="card-body">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Trophy className="w-10 h-10 text-success" />
            <h2 className="text-3xl font-bold text-base-content">Solved Problems</h2>
          </div>
          <div className="badge badge-primary badge-lg px-4 py-3 text-lg font-semibold">
            {solvedProblems.length} Solved
          </div>
        </div>

        <div className="space-y-4">
          {displayedProblems.map((problem) => (
            <div
              key={problem.id}
              className="card bg-base-200 hover:bg-base-300 transition-all duration-200 cursor-pointer"
            >
              <div className="card-body p-4 md:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg md:text-xl font-bold text-base-content">
                        {problem.title}
                      </h3>
                      {problem.difficulty && (
                        <div
                          className={`badge ${getDifficultyColor(problem.difficulty)} badge-md md:badge-lg`}
                        >
                          {problem.difficulty}
                        </div>
                      )}
                    </div>

                    {problem.description && (
                      <p className="text-base-content/70 text-sm md:text-base mb-4 line-clamp-2">
                        {problem.description}
                      </p>
                    )}

                    <div className="flex items-center gap-6 text-xs md:text-sm text-base-content/80">
                      {problem.solvedBy?.[0]?.solvedAt && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-info" />
                          <span>Solved on {formatDate(problem.solvedBy[0].solvedAt)}</span>
                        </div>
                      )}

                      {problem.tags?.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-secondary" />
                          <span>{problem.tags.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="ml-6 flex-shrink-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-success/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 md:w-7 md:h-7 text-success" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {solvedProblems.length > 2 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="btn btn-outline btn-primary btn-sm px-6"
            >
              {showAll ? (
                <>
                  Show Less <ChevronUp className="ml-2 w-4 h-4" />
                </>
              ) : (
                <>
                  Show All <ChevronDown className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolvedProblems;
