export const initialVideos = [];

const defaultCategories = [];

export const getStoredCategories = () => {
  const stored = localStorage.getItem('play_stream_categories');
  const dbVersion = localStorage.getItem('play_stream_categories_version');
  if (stored && dbVersion === '3') {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse stored categories", e);
    }
  }
  // Initialize storage if empty
  localStorage.setItem('play_stream_categories', JSON.stringify(defaultCategories));
  localStorage.setItem('play_stream_categories_version', '3');
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

  if (stored && dbVersion === '3') {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse stored videos", e);
    }
  }
  // Initialize or upgrade database to version 3 (with 0 items)
  localStorage.setItem('play_stream_videos', JSON.stringify(initialVideos));
  localStorage.setItem('play_stream_db_version', '3');
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
