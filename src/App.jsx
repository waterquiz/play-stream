import { useState, useEffect } from 'react';
import Header from './components/Header';
import VideoGrid from './components/VideoGrid';
import VideoDetail from './components/VideoDetail';
import AdminModal from './components/AdminModal';
import { getVideos, addVideo, deleteVideo } from './data/initialVideos';

function App() {
  const [videos, setVideos] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Check URL query parameter for Admin Mode
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setIsAdminMode(true);
    }
  }, []);

  // Initialize videos from localStorage
  useEffect(() => {
    setVideos(getVideos());
  }, []);

  // Handlers
  const handleSelectVideo = (id) => {
    setSelectedVideoId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setSelectedVideoId(null);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedVideoId(null); // return to search feed
  };

  const handleFilterCategory = (category) => {
    setActiveCategory(category);
    setSearchQuery('');
    setSelectedVideoId(null); // return to filtered feed
  };

  const handleAddVideo = (newVideo) => {
    addVideo(newVideo);
    setVideos(getVideos()); // refresh list
    setIsAdminOpen(false);
  };

  const handleDeleteVideo = (id) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      deleteVideo(id);
      setVideos(getVideos()); // refresh list
      if (selectedVideoId === id) {
        setSelectedVideoId(null); // go home if active was deleted
      }
    }
  };

  // Get active labels - restricted to the 6 official main categories
  const getCategories = () => {
    return ['All', 'Animation', 'Movies', 'Space', 'Science', 'Music'];
  };

  // Filtered List
  const filteredVideos = videos.filter(video => {
    const matchesCategory = activeCategory === 'All' || (video.labels && video.labels.includes(activeCategory));
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (video.description && video.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Find active video details
  const activeVideo = videos.find(v => v.id === selectedVideoId);

  return (
    <div className="app-container">
      {/* Premium Header - handles categories and search responsive layout */}
      <Header 
        onSearch={handleSearch} 
        onGoHome={handleBackToHome}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminMode={isAdminMode}
        categories={getCategories()}
        activeCategory={activeCategory}
        onSelectCategory={handleFilterCategory}
        showCategories={!selectedVideoId}
      />

      <main className="container">
        {selectedVideoId && activeVideo ? (
          /* Video Detail Page View */
          <VideoDetail 
            video={activeVideo} 
            videos={videos}
            onBack={handleBackToHome}
            onSelectVideo={handleSelectVideo}
            onDelete={handleDeleteVideo}
            isAdminMode={isAdminMode}
          />
        ) : (
          /* Homepage View */
          <VideoGrid 
            videos={filteredVideos} 
            onSelectVideo={handleSelectVideo} 
          />
        )}
      </main>

      {/* Admin Local CMS Modal */}
      {isAdminOpen && (
        <AdminModal 
          onClose={() => setIsAdminOpen(false)}
          onAdd={handleAddVideo}
        />
      )}
    </div>
  );
}

export default App;
