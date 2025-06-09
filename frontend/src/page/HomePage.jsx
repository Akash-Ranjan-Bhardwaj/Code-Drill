import React, { useEffect } from "react";
import { useProblemStore } from "../store/useProblemStore";
import { Loader, Code, Target, Trophy, Search, ChevronRight, BookOpen, Clock, Award } from "lucide-react";
import ProblemTable from "../components/ProblemTable";

const HomePage = () => {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  if (isProblemsLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="w-10 h-10 animate-spin text-blue-500" />
          <p className="text-gray-300 text-lg">Loading problems...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      icon: BookOpen,
      label: "Total Problems",
      value: problems.length,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20"
    },
    {
      icon: Clock,
      label: "Practice Time",
      value: "24/7",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20"
    },
    {
      icon: Award,
      label: "Skill Level",
      value: "Pro",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="text-white">Code</span>
            <span className="text-blue-400">Drill</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Master coding interviews through deliberate practice. Solve problems, track progress, and level up your skills.
          </p>
          
          {/* CTA Button */}
          <button className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 group">
            Start Practicing
            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} ${stat.borderColor} border rounded-xl p-8 text-center hover:border-opacity-40 transition-all duration-200`}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="p-3 bg-gray-800 rounded-full">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        {problems.length > 0 ? (
          <div className="space-y-8">
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Practice Problems
                </h2>
                <p className="text-gray-400">
                  Choose a problem below to start coding
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {problems.length} problems available
              </div>
            </div>

            {/* Problems Table */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <ProblemTable problems={problems} />
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                No Problems Available
              </h3>
              <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                Problems will be added soon. Check back later to start your coding journey.
              </p>
            </div>
            
            <div className="inline-flex items-center px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg">
              <Code className="w-5 h-5 text-blue-400 mr-3" />
              <span className="text-gray-300 font-medium">
                Coming soon...
              </span>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-20 pt-16 border-t border-gray-800">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Why Choose CodeDrill?
            </h2>
            <p className="text-gray-400 text-lg">
              Everything you need to ace your coding interviews
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Quality Problems
              </h3>
              <p className="text-gray-400">
                Carefully curated problems from real interviews at top companies
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Track Progress
              </h3>
              <p className="text-gray-400">
                Monitor your improvement and identify areas for growth
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Interview Ready
              </h3>
              <p className="text-gray-400">
                Build confidence and skills needed for technical interviews
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;