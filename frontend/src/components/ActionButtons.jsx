import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Target, FileText } from 'lucide-react';
import { usePlaylistStore } from '../store/usePlaylistStore';
import CreatePlaylistModal from './CreatePlaylistModal'; // Adjust path if needed
import toast from 'react-hot-toast';
const frontendBaseUrl= import.meta.env.VITE_API_FRONTEND_BASE_URL;

const ActionButtons = () => {
  const navigate = useNavigate();
  const createPlaylist = usePlaylistStore((state) => state.createPlaylist);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handlePracticeClick = () => {
    navigate(`/home`);
  };

  const handleCreatePlaylist = async (data) => {
    try {
      await createPlaylist(data);
    //   toast.success('Playlist created');
    } catch (error) {
      // Error already handled in store
    }
  };

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-3">
        <button className="btn btn-primary btn-sm rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300 border-primary/20">
          <Trophy className="w-4 h-4 mr-2" />
          Beginner
        </button>

        <button
          onClick={handlePracticeClick}
          className="btn btn-outline btn-primary btn-sm rounded-full px-6 hover:shadow-lg transition-all duration-300 hover:bg-primary/10"
        >
          <Target className="w-4 h-4 mr-2" />
          Practice Problems
        </button>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn btn-ghost btn-sm rounded-full px-6 hover:bg-base-300 transition-all duration-300 text-base-content"
        >
          <FileText className="w-4 h-4 mr-2" />
          Create Playlist
        </button>
      </div>

      {/* Modal */}
      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlaylist}
      />
    </>
  );
};

export default ActionButtons;
