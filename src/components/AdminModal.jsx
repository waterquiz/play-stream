import { useState } from 'react';
import { X } from 'lucide-react';

function AdminModal({ onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [iframe, setIframe] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [labelsString, setLabelsString] = useState('');
  const [duration, setDuration] = useState('');
  const [views, setViews] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !iframe.trim()) {
      alert("Title and Video Embed Code are required!");
      return;
    }

    // Clean up category labels
    const labels = labelsString
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '');

    if (labels.length === 0) {
      labels.push("General");
    }

    onAdd({
      title: title.trim(),
      iframe: iframe.trim(),
      imageUrl: imageUrl.trim() || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60",
      labels,
      duration: duration.trim() || "5:00",
      views: views.trim() || "1.2K",
      description: description.trim()
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Video</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="video-title">Video Title *</label>
            <input 
              id="video-title"
              type="text" 
              className="form-control" 
              placeholder="e.g. Elden Ring DLC Official Gameplay Trailer"
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
              <label htmlFor="video-labels">Category Labels (Comma separated)</label>
              <input 
                id="video-labels"
                type="text" 
                className="form-control" 
                placeholder="e.g. Gaming, Trailer"
                value={labelsString}
                onChange={(e) => setLabelsString(e.target.value)}
              />
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
              placeholder="Write a brief overview of what this video is about..."
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
      </div>
    </div>
  );
}

export default AdminModal;
