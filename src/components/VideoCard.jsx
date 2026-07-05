function VideoCard({ video, onSelect }) {
  const { id, title, imageUrl, duration, views, date } = video;

  return (
    <button className="video-card" onClick={() => onSelect(id)}>
      <div className="thumbnail-wrapper">
        <img className="thumbnail-img" src={imageUrl} alt={title} loading="lazy" />
        {duration && <span className="duration-tag">{duration}</span>}
      </div>
      <div className="video-info">
        <div className="channel-avatar">
          <img src="/logo.png" alt="Play Stream Brand" />
        </div>
        <div className="meta-content">
          <h3 className="video-title" title={title}>{title}</h3>
          <div className="video-metadata">
            <span className="meta-views">{views} views</span>
            <span className="meta-date">{date}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

export default VideoCard;
