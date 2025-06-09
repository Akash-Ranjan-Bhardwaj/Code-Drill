import React from "react";
import { Link, useLocation } from "react-router-dom";
import { User, ListChecks, Folder, BarChart2, Settings } from "lucide-react";

const ProfileSidebar = ({ onScrollToSection, showQuickNav = false, quickNavItems = [] }) => {
  const location = useLocation();
  
  const sidebarItems = [
    { id: "profile", label: "Profile & Solved", icon: User, path: "/profile" },
    { id: "playlists", label: "Playlists", icon: Folder, path: "/profile/playlists" },
    { id: "stats", label: "Statistics", icon: BarChart2, path: "/profile/statistics" },
    { id: "settings", label: "Account Settings", icon: Settings, path: "/profile/settings" },
  ];

  const isCurrentPath = (path) => location.pathname === path;

  return (
    <div className="w-64 hidden lg:block sticky top-6 h-fit bg-base-100 shadow-md rounded-xl p-6">
      <button
        onClick={() => (window.location.href = "http://localhost:5173/")}
        className="btn btn-sm btn-outline btn-primary w-full mb-4"
      >
        ← Back to Home
      </button>

      <h2 className="text-xl font-bold mb-4 text-base-content">Navigation</h2>
      
      <ul className="space-y-3 text-base-content/80 text-sm">
        {sidebarItems.map((item) => (
          <li key={item.id}>
            {isCurrentPath(item.path) ? (
              <div className="w-full text-left px-3 py-2 rounded-lg bg-primary/10 text-primary transition-all flex items-center gap-3">
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </div>
            ) : (
              <Link
                to={item.path}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-base-300 transition-all flex items-center gap-3 block"
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>

      {/* Quick Navigation within current page */}
      {showQuickNav && quickNavItems.length > 0 && (
        <div className="mt-6 pt-4 border-t border-base-300">
          <h3 className="text-sm font-semibold mb-3 text-base-content/60">
            ON THIS PAGE
          </h3>
          <ul className="space-y-2 text-xs">
            {quickNavItems.map((navItem) => (
              <li key={navItem.id}>
                <button
                  onClick={() => onScrollToSection && onScrollToSection(navItem.id)}
                  className="w-full text-left px-2 py-1 rounded hover:bg-base-300 transition-all text-base-content/70"
                >
                  {navItem.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileSidebar;