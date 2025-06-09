import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import SolvedProblems from "../components/SolvedProblems.jsx";
import { axiosInstance } from "../lib/axios.js";
import PlaylistSection from "../components/PlaylistSection.jsx";
import ProfileHeaderCard from "../components/ProfileHeaderCard";
import StatisticsSection from "../components/StatisticsSection.jsx";
import { useSubmissions } from "../hooks/useSubmissions"; // adjust path if needed
import AccountSettings from "../components/AccountSettings.jsx";
import { User, ListChecks, Folder, BarChart2, Settings } from "lucide-react";
const frontendURL = import.meta.env.VITE_API_FRONTEND_BASE_URL;

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPlaylistId, setExpandedPlaylistId] = useState(null);

  // ✅ Avoid name conflict by renaming this
  const { submissions: fetchedSubmissions, loading: submissionsLoading } =
    useSubmissions();

  const togglePlaylist = (id) => {
    setExpandedPlaylistId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const playlistRes = await axiosInstance.get("/playlist");
        const playlistsData = playlistRes.data.playLists || [];
        setPlaylists(playlistsData);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setPlaylists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeletePlaylist = async (playlistId) => {
    if (!window.confirm("Are you sure you want to delete this playlist?"))
      return;
    try {
      await axiosInstance.delete(`/playlist/${playlistId}`);
      setPlaylists(playlists.filter((p) => p.id !== playlistId));
    } catch (error) {
      console.error("Error deleting playlist:", error);
      alert("Failed to delete playlist");
    }
  };

  const totalCorrectSubmissions = fetchedSubmissions.filter(
    (sub) =>
      sub.status?.toLowerCase() === "accepted" ||
      sub.status?.toLowerCase() === "ac" ||
      sub.status?.toLowerCase() === "correct"
  ).length;

  const totalWrongSubmissions = fetchedSubmissions.filter(
    (sub) =>
      sub.status?.toLowerCase() === "wrong" ||
      sub.status?.toLowerCase() === "wrong answer" ||
      sub.status?.toLowerCase() === "incorrect" ||
      sub.status?.toLowerCase() === "rejected" ||
      sub.status?.toLowerCase() === "runtime error" ||
      sub.status?.toLowerCase() === "compilation error"
  ).length;

  const sidebarItems = [
    { id: "profile", label: "Profile Info", icon: User },
    { id: "solved", label: "Solved Problems", icon: ListChecks },
    { id: "playlists", label: "Playlists", icon: Folder },
    { id: "stats", label: "Statistics", icon: BarChart2 },
    // { id: "settings", label: "Account Settings", icon: Settings },
  ];

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen w-full bg-base-200 py-6 px-4 xl:px-24">
      <div className="flex max-w-[1600px] mx-auto gap-6">
        {/* Sidebar */}
        <div className="w-64 hidden lg:block sticky top-6 h-fit bg-base-100 shadow-md rounded-xl p-6">
          <Link to="/home" className="btn btn-sm btn-outline btn-primary w-full mb-4">
            ← Back to Home
            </Link>

          <h2 className="text-xl font-bold mb-4 text-base-content">
            Quick Navigation
          </h2>
          <ul className="space-y-3 text-base-content/80 text-sm">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-base-300 transition-all flex items-center gap-3" // <-- The fix is here
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />{" "}
                  {/* Added flex-shrink-0 */}
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-10">
          <div id="profile">
            <ProfileHeaderCard
              authUser={authUser}
              playlists={playlists}
              submissions={fetchedSubmissions}
              totalCorrectSubmissions={totalCorrectSubmissions}
              totalWrongSubmissions={totalWrongSubmissions}
            />
          </div>

          <div id="solved">
            <SolvedProblems />
          </div>

          <div id="playlists">
            <PlaylistSection
              playlists={playlists}
              expandedPlaylistId={expandedPlaylistId}
              togglePlaylist={togglePlaylist}
              handleDeletePlaylist={handleDeletePlaylist}
            />
          </div>

          {/* Add a div with id="stats" here */}
          <div id="stats">
            <StatisticsSection
              totalCorrect={totalCorrectSubmissions}
              totalWrong={totalWrongSubmissions}
            />
          </div>
          {/* <div
            id="settings"
            className="card bg-base-100 p-6 shadow-xl rounded-2xl"
          >
            <AccountSettings />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
