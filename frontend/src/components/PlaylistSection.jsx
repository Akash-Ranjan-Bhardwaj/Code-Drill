import React from "react";
import { Link } from "react-router-dom";
import {
  Star,
  PlusCircle,
  Trash2,
  BookOpen,
  Calendar,
  Code,
  ExternalLink,
  BarChart2,
  Tag,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "../components/ui/button";

const PlaylistSection = ({
  playlists,
  expandedPlaylistId,
  togglePlaylist,
  handleDeletePlaylist
}) => {
  if (playlists.length === 0) {
    return (
      <div className="p-2 md:p-6 card bg-base-100 shadow-xl rounded-2xl mb-12">
        <div className="card-body">
          <div className="flex items-center space-x-4 mb-6">
            <Star className="w-10 h-10 text-yellow-500" />
            <h2 className="text-3xl font-bold text-base-content">Your Playlists</h2>
          </div>
          <div className="text-center p-16">
            <div className="w-32 h-32 bg-base-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-16 h-16 text-base-content/60" />
            </div>
            <h3 className="text-2xl font-semibold text-base-content mb-3">No Playlists Found</h3>
            <p className="text-base-content/70 text-lg mb-6">
              Organize your learning by creating custom playlists.
            </p>
            <Link to="/create-playlist">
              <Button className="btn btn-primary px-6 py-2 text-base">
                <PlusCircle className="w-5 h-5 mr-2" />
                Create Playlist
              </Button>
            </Link>
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
            <Star className="w-10 h-10 text-yellow-500" />
            <h2 className="text-3xl font-bold text-base-content">Your Playlists</h2>
          </div>
          
        </div>

        <div className="space-y-5">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="card bg-base-200 hover:bg-base-300 transition-all duration-200">
              <div className="card-body p-4 md:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="text-xl font-bold text-base-content">{playlist.name}</h3>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-primary hover:bg-base-300"
                          onClick={() => togglePlaylist(playlist.id)}
                        >
                          {expandedPlaylistId === playlist.id ? (
                            <>
                              Hide <ChevronUp className="w-4 h-4 ml-1" />
                            </>
                          ) : (
                            <>
                              View <ChevronDown className="w-4 h-4 ml-1" />
                            </>
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-red-500 hover:bg-red-100"
                          onClick={() => handleDeletePlaylist(playlist.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-base-content/70 mb-3">
                      {playlist.description || "No description provided."}
                    </p>

                    <div className="flex items-center gap-6 text-sm text-base-content/80">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        {playlist.problems.length} Problems
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-500" />
                        Created recently
                      </div>
                    </div>
                  </div>
                </div>

                {expandedPlaylistId === playlist.id && (
                  <div className="mt-5 pt-4 border-t border-base-300 space-y-3">
                    <h4 className="text-base font-semibold text-base-content mb-3 flex items-center">
                      <Code className="w-4 h-4 mr-2 text-primary" />
                      Problems in this playlist:
                    </h4>

                    {playlist.problems.length > 0 ? (
                      playlist.problems.map((p, index) => (
                        <Link
                          to={`/problem/${p.problemId}`}
                          key={p.problemId}
                          className="block p-4 bg-base-300 hover:bg-base-100 text-base-content rounded-xl border border-primary/30 hover:shadow-lg transition-all"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 bg-primary text-primary-content flex items-center justify-center text-xs font-bold rounded">
                                {index + 1}
                              </div>
                              <div className="font-medium text-base">{p.problem.title}</div>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-primary font-medium">
                              Solve <ExternalLink className="w-4 h-4" />
                            </div>
                          </div>
                          <div className="ml-10 flex gap-4 text-sm text-base-content/70">
                            <div className="flex items-center gap-1">
                              <BarChart2 className="w-4 h-4 text-purple-400" />
                              {p.problem.difficulty}
                            </div>
                            <div className="flex items-center gap-1">
                              <Tag className="w-4 h-4 text-green-400" />
                              {p.problem.tags.slice(0, 3).join(", ")}
                              {p.problem.tags.length > 3 && "…"}
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="text-base-content/70">No problems in this playlist yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaylistSection;