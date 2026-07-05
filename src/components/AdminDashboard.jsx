import { useState } from 'react';
import { 
  Home, 
  LayoutGrid, 
  UploadCloud, 
  Folder, 
  LogOut, 
  Eye, 
  Trash2, 
  Plus,
  Video,
  BarChart2,
  Database,
  Copy,
  Check
} from 'lucide-react';

// Maps category names to colored dots
const getCategoryColor = (category) => {
  switch (category.toLowerCase()) {
    case 'animation':
    case 'anime':
      return '#818cf8'; // Purple
    case 'movies':
    case 'sci-fi':
      return '#ef4444'; // Red
    case 'science':
      return '#3b82f6'; // Blue
    case 'music':
      return '#f59e0b'; // Amber/Yellow
    case 'space':
      return '#06b6d4'; // Cyan
    case 'gaming':
      return '#f97316'; // Orange
    default:
      return '#64748b'; // Slate
  }
};

function AdminDashboard({ 
  videos, 
  categories, 
  onAddVideo, 
  onDeleteVideo, 
  onAddCategory, 
  onDeleteCategory,
  onLogout,
  onViewSite 
}) {
  const [activeTab, setActiveTab] = useState('posts'); // 'dashboard', 'posts', 'upload', 'categories', 'export'
  const [copied, setCopied] = useState(false);

  // Video Upload Form State
  const [title, setTitle] = useState('');
  const [iframe, setIframe] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [duration, setDuration] = useState('');
  const [views, setViews] = useState('');
  const [description, setDescription] = useState('');

  // Category Add State
  const [newCatName, setNewCatName] = useState('');

  // Calculate dynamic statistics
  const totalVideos = videos.length;
  const totalCategories = categories.filter(c => c !== 'All').length;
  
  const calculateTotalViews = () => {
    let sum = 0;
    videos.forEach(v => {
      if (v.views) {
        const numeric = parseFloat(v.views.replace(/[^\d.]/g, ''));
        if (!isNaN(numeric)) {
          if (v.views.toLowerCase().includes('m')) sum += numeric * 1000000;
          else if (v.views.toLowerCase().includes('k')) sum += numeric * 1000;
          else sum += numeric;
        }
      }
    });
    // Format sum to clean abbreviation
    if (sum >= 1000000) return (sum / 1000000).toFixed(1) + 'M';
    if (sum >= 1000) return (sum / 1000).toFixed(1) + 'K';
    return sum.toString();
  };

  const getPostCount = (categoryName) => {
    return videos.filter(v => v.labels && v.labels.includes(categoryName)).length;
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !iframe.trim() || !selectedCategory) {
      alert("Title, Embed Code, and Category are required!");
      return;
    }

    onAddVideo({
      title: title.trim(),
      iframe: iframe.trim(),
      imageUrl: imageUrl.trim() || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60",
      labels: [selectedCategory],
      duration: duration.trim() || "5:00",
      views: views.trim() || "1.2K",
      description: description.trim()
    });

    // Reset Form
    setTitle('');
    setIframe('');
    setImageUrl('');
    setSelectedCategory('');
    setDuration('');
    setViews('');
    setDescription('');
    setActiveTab('posts'); // switch back to posts list!
  };

  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    onAddCategory(trimmed);
    setNewCatName('');
  };

  // Compile database code dynamically
  const generateDatabaseCode = () => {
    const cleanCategories = categories.filter(c => c !== 'All');
    
    return `export const initialVideos = ${JSON.stringify(videos, null, 2)};

const defaultCategories = ${JSON.stringify(cleanCategories, null, 2)};

export const getStoredCategories = () => {
  const stored = localStorage.getItem('play_stream_categories');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse stored categories", e);
    }
  }
  // Initialize storage if empty
  localStorage.setItem('play_stream_categories', JSON.stringify(defaultCategories));
  return defaultCategories;
};

export const saveStoredCategories = (categories) => {
  localStorage.setItem('play_stream_categories', JSON.stringify(categories));
};

export const addStoredCategory = (categoryName) => {
  const list = getStoredCategories();
  const trimmedName = categoryName.trim();
  if (trimmedName && !list.includes(trimmedName)) {
    list.push(trimmedName);
    saveStoredCategories(list);
  }
  return list;
};

export const deleteStoredCategory = (categoryName) => {
  const list = getStoredCategories();
  const filtered = list.filter(c => c !== categoryName);
  saveStoredCategories(filtered);
  return filtered;
};

// Helper functions to manage LocalStorage Videos
export const getVideos = () => {
  const stored = localStorage.getItem('play_stream_videos');
  const dbVersion = localStorage.getItem('play_stream_db_version');

  if (stored && dbVersion === '2') {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse stored videos", e);
    }
  }
  // Initialize or upgrade database to version 2 (with 12 items)
  localStorage.setItem('play_stream_videos', JSON.stringify(initialVideos));
  localStorage.setItem('play_stream_db_version', '2');
  return initialVideos;
};

export const saveVideos = (videos) => {
  localStorage.setItem('play_stream_videos', JSON.stringify(videos));
};

export const addVideo = (newVideo) => {
  const list = getVideos();
  const videoWithId = {
    ...newVideo,
    id: 'post-' + Date.now(),
    date: new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  };
  list.unshift(videoWithId);
  saveVideos(list);
  return videoWithId;
};

export const deleteVideo = (id) => {
  const list = getVideos();
  const filtered = list.filter(v => v.id !== id);
  saveVideos(filtered);
  return filtered;
};
`;
  };

  const handleCopyCode = () => {
    const code = generateDatabaseCode();
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="admin-layout">
      {/* 1. Left Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <img src="/logo.png" alt="Play Stream Logo" className="sidebar-logo-img" />
          <span className="sidebar-brand-text">
            <span style={{ color: '#0f172a' }}>PLAY</span> <span style={{ color: 'var(--accent-color)' }}>STREAM</span>
          </span>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`sidebar-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Home size={18} />
            Dashboard
          </button>

          <div className="sidebar-section-header">CONTENT</div>

          <button 
            className={`sidebar-nav-item ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            <LayoutGrid size={18} />
            Posts
          </button>

          <button 
            className={`sidebar-nav-item ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            <UploadCloud size={18} />
            Upload New Post
          </button>

          <button 
            className={`sidebar-nav-item ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <Folder size={18} />
            Categories
          </button>

          <div className="sidebar-section-header">PUBLISH</div>

          <button 
            className={`sidebar-nav-item ${activeTab === 'export' ? 'active' : ''}`}
            onClick={() => setActiveTab('export')}
          >
            <Database size={18} />
            Export Database
          </button>
        </nav>

        {/* Sidebar Footer Operations */}
        <div className="sidebar-footer">
          <button className="sidebar-footer-btn view-site-btn" onClick={onViewSite}>
            <Eye size={16} />
            View Website
          </button>
          <button className="sidebar-footer-btn logout-btn" onClick={onLogout}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* 2. Main Content Dashboard Container */}
      <main className="admin-main">
        {/* TAB A: OVERVIEW DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-content">
            <h1 className="admin-page-title">Dashboard Overview</h1>
            <p className="admin-page-subtitle">Welcome back! Here is a summary of your streaming catalog.</p>

            <div className="stats-cards-grid">
              <div className="stat-card">
                <div className="stat-card-icon" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-color)' }}>
                  <Video size={24} />
                </div>
                <div className="stat-card-info">
                  <span className="stat-card-value">{totalVideos}</span>
                  <span className="stat-card-label">Total Video Posts</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card-icon" style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' }}>
                  <Folder size={24} />
                </div>
                <div className="stat-card-info">
                  <span className="stat-card-value">{totalCategories}</span>
                  <span className="stat-card-label">Active Categories</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                  <BarChart2 size={24} />
                </div>
                <div className="stat-card-info">
                  <span className="stat-card-value">{calculateTotalViews()}</span>
                  <span className="stat-card-label">Estimated Views</span>
                </div>
              </div>
            </div>

            <div className="dashboard-promo-box">
              <h3>Direct Vercel Deployment Enabled</h3>
              <p>Your streaming platform is integrated with GitHub. Adding, editing, or deleting items updates immediately in your browser cache. To publish these changes to all visitors worldwide, use the **Export Database** page.</p>
              <button className="btn-primary" style={{ marginTop: '12px' }} onClick={() => setActiveTab('posts')}>
                Manage Video Posts
              </button>
            </div>
          </div>
        )}

        {/* TAB B: ALL POSTS TABLE LIST */}
        {activeTab === 'posts' && (
          <div className="dashboard-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h1 className="admin-page-title">All Posts</h1>
                <p className="admin-page-subtitle">Manage, view, and delete video assets.</p>
              </div>
              <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setActiveTab('upload')}>
                <Plus size={16} />
                Upload New Post
              </button>
            </div>

            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '50px' }}>#</th>
                    <th style={{ width: '120px' }}>Thumbnail</th>
                    <th>Title</th>
                    <th style={{ width: '120px' }}>Category</th>
                    <th style={{ width: '90px' }}>Duration</th>
                    <th style={{ width: '90px' }}>Views</th>
                    <th style={{ width: '130px' }}>Date</th>
                    <th style={{ width: '80px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map((video, idx) => {
                    const primaryLabel = video.labels && video.labels[0] ? video.labels[0] : 'Uncategorized';
                    const pillColor = getCategoryColor(primaryLabel);

                    return (
                      <tr key={video.id}>
                        <td>{idx + 1}</td>
                        <td>
                          <div className="table-thumb-wrapper">
                            <img src={video.imageUrl} alt={video.title} className="table-thumb-img" />
                            <span className="table-duration-badge">{video.duration}</span>
                          </div>
                        </td>
                        <td>
                          <div className="table-video-title" title={video.title}>
                            {video.title}
                          </div>
                        </td>
                        <td>
                          <span 
                            className="table-category-pill"
                            style={{ 
                              backgroundColor: `${pillColor}15`, 
                              color: pillColor 
                            }}
                          >
                            {primaryLabel}
                          </span>
                        </td>
                        <td>{video.duration}</td>
                        <td>{video.views}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>{video.date}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            className="table-action-delete"
                            onClick={() => onDeleteVideo(video.id)}
                            title="Delete Post"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {videos.length === 0 && (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        No videos found in the database. Click "Upload New Post" to start adding!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB C: UPLOAD NEW POST */}
        {activeTab === 'upload' && (
          <div className="dashboard-content">
            <h1 className="admin-page-title">Upload New Post</h1>
            <p className="admin-page-subtitle">Add a new video content page to the public grid.</p>

            <form onSubmit={handleUploadSubmit} className="admin-form-container">
              <div className="form-group">
                <label htmlFor="upload-title">Video Title *</label>
                <input 
                  id="upload-title"
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Elden Ring DLC Gameplay Trailer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="upload-embed">Video Embed Code (HTML iframe) *</label>
                <textarea 
                  id="upload-embed"
                  className="form-control" 
                  placeholder='e.g. <iframe src="https://playmogo.com/e/..."></iframe>'
                  value={iframe}
                  onChange={(e) => setIframe(e.target.value)}
                  required
                  style={{ minHeight: '100px' }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="upload-thumb">Thumbnail Image URL (Optional)</label>
                <input 
                  id="upload-thumb"
                  type="url" 
                  className="form-control" 
                  placeholder="e.g. https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label htmlFor="upload-category">Category Label *</label>
                  <select 
                    id="upload-category"
                    className="form-control"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    required
                  >
                    <option value="">-- Select Category --</option>
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="upload-duration">Video Duration (Optional)</label>
                  <input 
                    id="upload-duration"
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. 5:20"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="upload-views">Mock Views (Optional)</label>
                <input 
                  id="upload-views"
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. 45.8M"
                  value={views}
                  onChange={(e) => setViews(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="upload-desc">Video Description (Optional)</label>
                <textarea 
                  id="upload-desc"
                  className="form-control" 
                  placeholder="Write a brief overview of this video..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ minHeight: '120px' }}
                />
              </div>

              <div style={{ marginTop: '10px' }}>
                <button type="submit" className="btn-primary" style={{ padding: '12px 24px', fontSize: '14px' }}>
                  Upload Video
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB D: CATEGORIES MANAGEMENT */}
        {activeTab === 'categories' && (
          <div className="dashboard-content">
            <h1 className="admin-page-title">Manage Categories</h1>
            <p className="admin-page-subtitle">Add, edit, or delete dynamic filter categories.</p>

            <div className="admin-categories-layout">
              {/* Category creation box */}
              <form onSubmit={handleAddCategorySubmit} className="category-add-box">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter new category name" 
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  required
                />
                <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                  <Plus size={16} />
                  Add Category
                </button>
              </form>

              {/* Category List */}
              <div className="category-list-container">
                {categories.filter(c => c !== 'All').map(c => {
                  const dotColor = getCategoryColor(c);
                  const postCount = getPostCount(c);

                  return (
                    <div key={c} className="category-list-item">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span 
                          className="category-dot"
                          style={{ backgroundColor: dotColor }}
                        />
                        <div>
                          <div className="category-name">{c}</div>
                          <div className="category-posts-count">{postCount} posts</div>
                        </div>
                      </div>
                      <div className="category-item-actions">
                        <button 
                          className="category-action-delete"
                          onClick={() => onDeleteCategory(c)}
                          title={`Delete "${c}"`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {categories.filter(c => c !== 'All').length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '14px' }}>
                    No custom labels created yet. Add one above!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB E: EXPORT DATABASE */}
        {activeTab === 'export' && (
          <div className="dashboard-content">
            <h1 className="admin-page-title">Export Database Code</h1>
            <p className="admin-page-subtitle">Publish your local videos and categories globally to all visitors.</p>

            <div className="admin-form-container" style={{ gap: '24px' }}>
              <div style={{ backgroundColor: '#f8fafc', borderLeft: '4px solid var(--accent-color)', padding: '20px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '12px' }}>
                  Why is this step required?
                </h3>
                <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.6' }}>
                  The streaming website runs entirely inside the browser's memory. When you make changes (adding videos, deleting categories) in the Admin Panel, it only updates your local browser profile's cache.
                </p>
                <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.6', marginTop: '10px' }}>
                  To save these changes permanently and publish them so that <strong>everyone in the world</strong> sees your custom list, copy the code below and save it to your project files before pushing to GitHub!
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '14px' }}>
                  Follow these step-by-step instructions:
                </h3>
                <ol style={{ fontSize: '14px', color: '#475569', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: '1.5' }}>
                  <li>
                    Click the <strong>"Copy Database Code"</strong> button below to copy the compiled database script to your clipboard.
                  </li>
                  <li>
                    Open your project's codebase in VS Code or any text editor on your computer.
                  </li>
                  <li>
                    Open the file: <code style={{ backgroundColor: '#e2e8f0', padding: '3px 6px', borderRadius: '4px', fontSize: '12.5px', fontWeight: '600' }}>src/data/initialVideos.js</code>.
                  </li>
                  <li>
                    Select all text in that file, delete it, and paste this copied code instead. Save the file.
                  </li>
                  <li>
                    Run your standard terminal command to deploy (e.g. <code style={{ backgroundColor: '#e2e8f0', padding: '3px 6px', borderRadius: '4px', fontSize: '12.5px', fontWeight: '600' }}>git push origin main</code>). Vercel will rebuild the website automatically and update the home feed for everyone!
                  </li>
                </ol>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Compiled Database Code
                  </span>
                  <button 
                    type="button" 
                    className="btn-primary" 
                    onClick={handleCopyCode}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      padding: '8px 16px', 
                      fontSize: '13px',
                      backgroundColor: copied ? '#10b981' : 'var(--accent-color)',
                      borderColor: copied ? '#10b981' : 'var(--accent-color)'
                    }}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied to Clipboard!' : 'Copy Database Code'}
                  </button>
                </div>

                <pre style={{ 
                  backgroundColor: '#0f172a', 
                  color: '#94a3b8', 
                  padding: '20px', 
                  borderRadius: '8px', 
                  fontFamily: 'monospace', 
                  fontSize: '12px', 
                  overflow: 'auto', 
                  maxHeight: '300px',
                  border: '1px solid #1e293b'
                }}>
                  {generateDatabaseCode()}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
