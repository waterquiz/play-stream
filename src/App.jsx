import { useState, useEffect } from 'react';
import Header from './components/Header';
import VideoGrid from './components/VideoGrid';
import VideoDetail from './components/VideoDetail';
import AdminModal from './components/AdminModal';
import AdminLogin from './components/AdminLogin';
import { 
  getVideos, 
  addVideo, 
  deleteVideo,
  getStoredCategories,
  addStoredCategory,
  deleteStoredCategory
} from './data/initialVideos';

function App() {
  const [videos, setVideos] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  // Admin Authentication State
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check URL query parameters and session storage for Admin Mode on mount and on popstate
  useEffect(() => {
    const checkAdminState = () => {
      const params = new URLSearchParams(window.location.search);
      const isAdmin = params.get('admin') === 'true';
      setIsAdminRoute(isAdmin);

      const loggedIn = sessionStorage.getItem('play_stream_admin_auth') === 'true';
      setIsAuthenticated(loggedIn);
    };

    checkAdminState();
    window.addEventListener('popstate', checkAdminState);
    return () => window.removeEventListener('popstate', checkAdminState);
  }, []);

  // Initialize videos & categories from storage
  useEffect(() => {
    setVideos(getVideos());
    setCategoriesList(getStoredCategories());
  }, []);

  // Login Handlers
  const handleLoginSuccess = () => {
    sessionStorage.setItem('play_stream_admin_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleCancelLogin = () => {
    // Clear admin parameter from URL and return to standard home view
    window.history.pushState({}, '', window.location.pathname);
    setIsAdminRoute(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('play_stream_admin_auth');
    setIsAuthenticated(false);
    setIsAdminRoute(false);
    window.history.pushState({}, '', window.location.pathname);
  };

  // Video Navigation Handlers
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

  // Dynamic Category Label Management Handlers
  const handleAddCategory = (newCat) => {
    const updatedList = addStoredCategory(newCat);
    setCategoriesList(updatedList);
  };

  const handleDeleteCategory = (catToDelete) => {
    if (window.confirm(`Are you sure you want to delete the category "${catToDelete}"? Videos belonging to this category will remain, but the filter label will be removed.`)) {
      const updatedList = deleteStoredCategory(catToDelete);
      setCategoriesList(updatedList);
      if (activeCategory === catToDelete) {
        setActiveCategory('All');
      }
    }
  };

  // Filtered list based on dynamic categories
  const filteredVideos = videos.filter(video => {
    const matchesCategory = activeCategory === 'All' || (video.labels && video.labels.includes(activeCategory));
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (video.description && video.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const activeVideo = videos.find(v => v.id === selectedVideoId);
  const finalCategories = ['All', ...categoriesList];
  
  // Decide whether admin controls should be active
  const isAdminMode = isAdminRoute && isAuthenticated;

  // Intercept view with Login card if admin parameter is present but user is not logged in
  if (isAdminRoute && !isAuthenticated) {
    return (
      <AdminLogin 
        onLoginSuccess={handleLoginSuccess}
        onCancel={handleCancelLogin}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Premium Header */}
      <Header 
        onSearch={handleSearch} 
        onGoHome={handleBackToHome}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminMode={isAdminMode}
        categories={finalCategories}
        activeCategory={activeCategory}
        onSelectCategory={handleFilterCategory}
        showCategories={!selectedVideoId}
        onLogout={handleLogout}
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
          categories={finalCategories}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      )}
    </div>
  );
}

export default App;
