import { ArrowLeft, Trash2 } from 'lucide-react';

function VideoDetail({ video, videos, onBack, onSelectVideo, onDelete, isAdminMode }) {
  const { id, title, iframe, views, date, labels } = video;

  // Extract iframe src
  const getIframeSrc = (iframeString) => {
    if (!iframeString) return '';
    const match = iframeString.match(/src="([^"]+)"/i);
    return match ? match[1] : iframeString;
  };

  const iframeSrc = getIframeSrc(iframe);

  // Sidebar recommended videos (excluding current video, limited to 6)
  const recommendations = videos
    .filter(v => v.id !== id)
    .slice(0, 6);

  return (
    <div className="post-page">
      {/* Back button */}
      <button className="back-to-home" onClick={onBack}>
        <ArrowLeft size={16} />
        Back to Home Feed
      </button>

      <div className="post-layout">
        {/* Main Player & Metadata */}
        <div className="player-section">
          <div className="player-container">
            {iframeSrc ? (
              <iframe
                src={iframeSrc}
                title={title}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              />
            ) : (
              <div style={{ padding: '40px', color: '#ffffff', textAlign: 'center' }}>
                No video embed source provided.
              </div>
            )}
          </div>

          <h1 className="post-title-main">{title}</h1>

          <div className="post-meta-details" style={{ marginBottom: isAdminMode ? '16px' : '30px' }}>
            <div className="post-author-info">
              <div className="author-avatar">
                <img src="/logo.png" alt="Play Stream Admin Avatar" />
              </div>
              <div className="author-name-sub">
                <span className="author-name">Play Stream Admin</span>
                <span className="author-subscribers">
                  {labels && labels.length > 0 ? (
                    <>
                      Category:{' '}
                      {labels.map((label, idx) => (
                        <span key={label}>
                          {label}
                          {idx < labels.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </>
                  ) : (
                    'Uncategorized'
                  )}
                </span>
              </div>
            </div>

            <div className="post-stats">
              <span className="stat-views">{views} views</span>
              <span>{date}</span>
            </div>
          </div>

          {/* Admin delete CMS controls (placed directly under metadata bar) */}
          {isAdminMode && (
            <div className="post-actions" style={{ marginBottom: '30px' }}>
              <button 
                className="action-btn-danger" 
                onClick={() => onDelete(id)}
              >
                <Trash2 size={14} style={{ marginRight: '6px', verticalAlign: 'middle', display: 'inline' }} />
                Delete Video from Database
              </button>
            </div>
          )}
        </div>

        {/* Recommended Sidebar Column */}
        <div className="sidebar-section">
          <h3 className="sidebar-heading">Up Next</h3>
          <div className="sidebar-video-list">
            {recommendations.map(rec => (
              <button 
                key={rec.id} 
                className="sidebar-card"
                onClick={() => onSelectVideo(rec.id)}
              >
                <div className="sidebar-thumb-wrapper">
                  <img className="sidebar-thumb-img" src={rec.imageUrl} alt={rec.title} />
                </div>
                <div>
                  <h4 className="sidebar-title">{rec.title}</h4>
                  <div className="sidebar-meta">{rec.views} views &bull; {rec.duration}</div>
                </div>
              </button>
            ))}
            {recommendations.length === 0 && (
              <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                No other videos available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoDetail;
