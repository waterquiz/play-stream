import VideoCard from './VideoCard';
import { VideoOff } from 'lucide-react';

function VideoGrid({ videos, onSelectVideo }) {
  if (videos.length === 0) {
    return (
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '100px 0',
          color: 'var(--text-muted)',
          width: '100%',
          textAlign: 'center'
        }}
      >
        <VideoOff size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
        <h3>No Videos Found</h3>
        <p style={{ marginTop: '8px', fontSize: '14px' }}>
          Try searching for another keyword or select a different category.
        </p>
      </div>
    );
  }

  return (
    <div className="video-grid">
      {videos.map((video) => (
        <VideoCard 
          key={video.id} 
          video={video} 
          onSelect={onSelectVideo} 
        />
      ))}
    </div>
  );
}

export default VideoGrid;
