import { useState } from 'react';
import { X, Trash2, Plus } from 'lucide-react';

function AdminModal({ 
  onClose, 
  onAdd, 
  categories, 
  onAddCategory, 
  onDeleteCategory 
}) {
  const [activeTab, setActiveTab] = useState('add-video'); // 'add-video' or 'categories'

  // Video Form State
  const [title, setTitle] = useState('');
  const [iframe, setIframe] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [duration, setDuration] = useState('');
  const [views, setViews] = useState('');
  const [description, setDescription] = useState('');

  // Category Form State
  const [newCatName, setNewCatName] = useState('');

  const handleSubmitVideo = (e) => {
    e.preventDefault();

    if (!title.trim() || !iframe.trim() || !selectedCategory) {
      alert("Title, Video Embed, and Category are required!");
      return;
    }

    onAdd({
      title: title.trim(),
      iframe: iframe.trim(),
      imageUrl: imageUrl.trim() || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60",
      labels: [selectedCategory], // Saves selected category label
      duration: duration.trim() || "5:00",
      views: views.trim() || "1.2K",
      description: description.trim()
    });
  };

  const handleAddCategorySubmit = () => {
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    onAddCategory(trimmed);
    setNewCatName('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Admin CMS Panel</h2>
          <button className="modal-close-btn" onClick={onClose} title="Close Panel">
            <X size={20} />
          </button>
        </div>

        {/* Tab navigation headers */}
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          marginBottom: '20px', 
          borderBottom: '1px solid var(--border-color)', 
          paddingBottom: '2px' 
        }}>
          <button 
            type="button" 
            onClick={() => setActiveTab('add-video')} 
            style={{ 
              background: 'none', 
              border: 'none', 
              fontFamily: 'var(--font-primary)',
              fontSize: '14px',
              fontWeight: activeTab === 'add-video' ? '700' : '500', 
              color: activeTab === 'add-video' ? 'var(--accent-color)' : 'var(--text-muted)',
              borderBottom: activeTab === 'add-video' ? '2.5px solid var(--accent-color)' : 'none',
              paddingBottom: '8px',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            Add New Video
          </button>
          <button 
            type="button" 
            onClick={() => setActiveTab('categories')} 
            style={{ 
              background: 'none', 
              border: 'none', 
              fontFamily: 'var(--font-primary)',
              fontSize: '14px',
              fontWeight: activeTab === 'categories' ? '700' : '500', 
              color: activeTab === 'categories' ? 'var(--accent-color)' : 'var(--text-muted)',
              borderBottom: activeTab === 'categories' ? '2.5px solid var(--accent-color)' : 'none',
              paddingBottom: '8px',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            Manage Category Labels
          </button>
        </div>

        {/* TAB 1: ADD VIDEO FORM */}
        {activeTab === 'add-video' && (
          <form className="modal-form" onSubmit={handleSubmitVideo}>
            <div className="form-group">
              <label htmlFor="video-title">Video Title *</label>
              <input 
                id="video-title"
                type="text" 
                className="form-control" 
                placeholder="e.g. Elden Ring DLC Gameplay Trailer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="video-embed">Video Embed Code (HTML iframe) *</label>
              <textarea 
                id="video-embed"
                className="form-control" 
                placeholder='e.g. <iframe src="https://playmogo.com/e/..."></iframe>'
                value={iframe}
                onChange={(e) => setIframe(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="video-thumb">Thumbnail Image URL (Optional)</label>
              <input 
                id="video-thumb"
                type="url" 
                className="form-control" 
                placeholder="e.g. https://images.unsplash.com/photo-..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label htmlFor="video-category">Category Label *</label>
                <select 
                  id="video-category"
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
                <label htmlFor="video-duration">Video Duration (Optional)</label>
                <input 
                  id="video-duration"
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. 5:20"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="video-views">Mock Views (Optional)</label>
              <input 
                id="video-views"
                type="text" 
                className="form-control" 
                placeholder="e.g. 45.8M"
                value={views}
                onChange={(e) => setViews(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="video-desc">Video Description (Optional)</label>
              <textarea 
                id="video-desc"
                className="form-control" 
                placeholder="Write a brief overview of this video..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Add Video
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: MANAGE CATEGORY LABELS */}
        {activeTab === 'categories' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Input to Add Category */}
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '500' }}>
                Add New Category Label:
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Action" 
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCategorySubmit()}
                />
                <button 
                  type="button" 
                  className="btn-primary" 
                  onClick={handleAddCategorySubmit}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 16px', whiteSpace: 'nowrap' }}
                >
                  <Plus size={16} />
                  Add Label
                </button>
              </div>
            </div>

            {/* List of Categories */}
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: '500' }}>
                Current Category Labels:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto', paddingRight: '4px' }}>
                {categories.filter(c => c !== 'All').map(c => (
                  <div 
                    key={c} 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '10px 14px', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: '8px', 
                      backgroundColor: '#f8fafc' 
                    }}
                  >
                    <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-main)' }}>{c}</span>
                    <button 
                      type="button" 
                      onClick={() => onDeleteCategory(c)}
                      title={`Delete "${c}"`}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#ef4444', 
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {categories.filter(c => c !== 'All').length === 0 && (
                  <div style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>
                    No custom labels set yet. Add one above!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminModal;
