import React from "react";
import {
  User,
  Mail,
  Shield,
  Hash,
  Calendar,
  Trophy,
  Target,
  CheckCircle,
  XCircle,
  FileText,
  Star,
} from "lucide-react";
import { StatCard } from "./StatCard";
import ActionButtons from "./ActionButtons";

const ProfileHeaderCard = ({
  authUser,
  playlists,
  submissions,
  totalCorrectSubmissions,
  totalWrongSubmissions,
}) => {
  const successRate =
    submissions.length > 0
      ? Math.round((totalCorrectSubmissions / submissions.length) * 100)
      : 0;

  const problemsInPlaylists = playlists.reduce(
    (acc, p) => acc + p.problems.length,
    0
  );

  return (
    <div className="relative">
      {/* Dark Mode Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/30 via-purple-900/20 to-blue-900/30 rounded-3xl"></div>

      <div className="relative card bg-base-100 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden border border-base-300">
        {/* Header Section with Dark Gradient Background */}
        <div className="relative bg-gradient-to-r from-slate-800 via-gray-800 to-slate-700 p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>

          <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-6">
            {/* Profile Image Section */}
            <div className="relative shrink-0">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 backdrop-blur-sm p-1.5 shadow-2xl border border-white/10">
                {authUser?.image ? (
                  <img
                    src={authUser.image}
                    alt="Profile"
                    className="w-full h-full rounded-2xl object-cover"
                  />
                ) : (
                    <img
                      src="https://avatar.iran.liara.run/public/boy"
                      alt="Profile"
                      className="w-full h-full rounded-2xl object-cover"
                    />
                )}
              </div>

              {/* Status Indicator */}
              <div className="absolute -bottom-2 -right-2 flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg border border-green-400">
                <div className="w-2 h-2 bg-green-200 rounded-full animate-pulse"></div>
                Active
              </div>
            </div>

            {/* User Info Section */}
            <div className="flex-1 text-white">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl lg:text-4xl font-bold text-white">
                  {authUser?.name || "Welcome User"}
                </h1>
                <Trophy className="w-8 h-8 text-yellow-400" />
              </div>

              <p className="text-gray-300 text-lg mb-4">
                Coding Enthusiast • Problem Solver
              </p>

              {/* User Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-200">{authUser?.email}</span>
                </div>

                <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-200 capitalize">
                    {authUser?.role}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-200">
                    ID: {authUser?.id || "USER123"}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                  <Calendar className="w-4 h-4 text-green-400" />
                  <span className="text-gray-200">Member since 2025</span>
                </div>
              </div>
            </div>

            {/* Success Rate Circle */}
            <div className="shrink-0 text-center">
              <div className="relative w-24 h-24 mx-auto mb-2">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#22c55e"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 40 * (1 - successRate / 100)
                    }`}
                    className="transition-all duration-1000 ease-out drop-shadow-lg"
                    style={{
                      filter: "drop-shadow(0 0 8px rgba(34, 197, 94, 0.3))",
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {successRate}%
                  </span>
                </div>
              </div>
              <p className="text-gray-300 text-sm font-medium">Success Rate</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="p-8 bg-base-100">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-base-200 rounded-xl p-4 text-base-content shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-base-300/50">
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-6 h-6 opacity-90" />
                <span className="text-2xl font-bold">{playlists.length}</span>
              </div>
              <p className="text-sm text-base-content/80">Playlists</p>
            </div>

            <div className="bg-base-200 rounded-xl p-4 text-base-content shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-base-300/50">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-6 h-6 opacity-90" />
                <span className="text-2xl font-bold">
                  {problemsInPlaylists}
                </span>
              </div>
              <p className="text-sm text-base-content/80">Problems</p>
            </div>

            <div className="bg-base-200 rounded-xl p-4 text-base-content shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-base-300/50">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-6 h-6 opacity-90" />
                <span className="text-2xl font-bold">
                  {totalCorrectSubmissions}
                </span>
              </div>
              <p className="text-sm text-base-content/80">Correct</p>
            </div>

            <div className="bg-base-200 rounded-xl p-4 text-base-content shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-base-300/50">
              <div className="flex items-center justify-between mb-2">
                <XCircle className="w-6 h-6 opacity-90" />
                <span className="text-2xl font-bold">
                  {totalWrongSubmissions}
                </span>
              </div>
              <p className="text-sm text-base-content/80">Wrong</p>
            </div>

            <div className="bg-base-200 rounded-xl p-4 text-base-content shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-base-300/50">
              <div className="flex items-center justify-between mb-2">
                <Hash className="w-6 h-6 opacity-90" />
                <span className="text-2xl font-bold">{submissions.length}</span>
              </div>
              <p className="text-sm text-base-content/80">Total</p>
            </div>

            <div className="bg-base-200 rounded-xl p-4 text-base-content shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-base-300/50">
              <div className="flex items-center justify-between mb-2">
                <Star className="w-6 h-6 opacity-90" />
                <span className="text-2xl font-bold">A+</span>
              </div>
              <p className="text-sm text-base-content/80">Grade</p>
            </div>
          </div>

          {/* Quick Actions */}
          <ActionButtons />
          {/* <div className="mt-8 flex flex-wrap gap-3">
            <button className="btn btn-primary btn-sm rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300 border-primary/20">
              <Trophy className="w-4 h-4 mr-2" />
              Begineer
            </button>
            <button className="btn btn-outline btn-primary btn-sm rounded-full px-6 hover:shadow-lg transition-all duration-300 hover:bg-primary/10">
              <Target className="w-4 h-4 mr-2" />
              Practice Problems
            </button>
            <button className="btn btn-ghost btn-sm rounded-full px-6 hover:bg-base-300 transition-all duration-300 text-base-content">
              <FileText className="w-4 h-4 mr-2" />
              Create Playlist
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeaderCard;
