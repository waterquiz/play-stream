import { useState, useEffect } from 'react';
import Header from './components/Header';
import VideoGrid from './components/VideoGrid';
import VideoDetail from './components/VideoDetail';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
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
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 12;

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
    setCurrentPage(1); // Reset page to 1
  };

  const handleFilterCategory = (category) => {
    setActiveCategory(category);
    setSearchQuery('');
    setSelectedVideoId(null); // return to filtered feed
    setCurrentPage(1); // Reset page to 1
  };

  const handleAddVideo = (newVideo) => {
    addVideo(newVideo);
    setVideos(getVideos()); // refresh list
    setCurrentPage(1); // Go to page 1 to see the new upload!
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
        setCurrentPage(1);
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

  // Calculate dynamic pagination bounds
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
  const paginatedVideos = filteredVideos.slice(
    (currentPage - 1) * videosPerPage, 
    currentPage * videosPerPage
  );

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

  // Render the full-screen redesigned Admin Dashboard if user is authenticated admin
  if (isAdminMode) {
    return (
      <AdminDashboard 
        videos={videos}
        categories={finalCategories}
        onAddVideo={handleAddVideo}
        onDeleteVideo={handleDeleteVideo}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        onLogout={handleLogout}
        onViewSite={handleCancelLogin}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Premium Header */}
      <Header 
        onSearch={handleSearch} 
        onGoHome={handleBackToHome}
        isAdminMode={false}
        categories={finalCategories}
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
            isAdminMode={false}
          />
        ) : (
          /* Homepage View (renders only paginated videos) */
          <>
            <VideoGrid 
              videos={paginatedVideos} 
              onSelectVideo={handleSelectVideo} 
            />

            {/* Pagination Controls bar */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <button 
                  className="pagination-btn" 
                  onClick={() => {
                    setCurrentPage(prev => Math.max(prev - 1, 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button 
                    key={page}
                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    {page}
                  </button>
                ))}

                <button 
                  className="pagination-btn" 
                  onClick={() => {
                    setCurrentPage(prev => Math.min(prev + 1, totalPages));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
