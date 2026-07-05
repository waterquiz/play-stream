import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Menu, 
  X, 
  SquarePlay, 
  Film, 
  Clapperboard, 
  Orbit, 
  FlaskConical, 
  Music, 
  Gamepad2, 
  Tv 
} from 'lucide-react';

// Maps category names to premium Lucide icons
const getCategoryIcon = (category) => {
  switch (category.toLowerCase()) {
    case 'all':
      return <SquarePlay size={18} />;
    case 'animation':
      return <Film size={18} />;
    case 'movies':
      return <Clapperboard size={18} />;
    case 'space':
      return <Orbit size={18} />;
    case 'science':
      return <FlaskConical size={18} />;
    case 'music':
      return <Music size={18} />;
    case 'gaming':
      return <Gamepad2 size={18} />;
    default:
      return <Tv size={18} />;
  }
};

function Header({ 
  onSearch, 
  onGoHome, 
  onOpenAdmin, 
  isAdminMode, 
  categories, 
  activeCategory, 
  onSelectCategory,
  showCategories 
}) {
  const [val, setVal] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(val);
    setMenuOpen(false); // Close mobile menu after search
  };

  const handleLogoClick = () => {
    setVal('');
    onGoHome();
    setMenuOpen(false);
  };

  return (
    <header>
      <div className="container header-wrapper">
        <div className="header-top-row">
          {/* Logo */}
          <button className="logo-container" onClick={handleLogoClick}>
            <img 
              src="/logo.png" 
              alt="Play Stream Logo" 
              className="logo-img"
            />
            <div>
              <span className="logo-text-play">PLAY</span> <span className="logo-text-stream">STREAM</span>
            </div>
          </button>

          {/* Desktop Navigation (Categories and Search side-by-side) */}
          <div className="desktop-nav">
            {showCategories && categories && (
              <div className="categories-container-inline">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`tag-pill ${activeCategory === category ? 'active' : ''}`}
                    onClick={() => onSelectCategory(category)}
                  >
                    {category === 'All' ? 'All Videos' : category}
                  </button>
                ))}
              </div>
            )}
            
            <div className="search-container">
              <form className="search-form" onSubmit={handleSubmit}>
                <div className="search-icon">
                  <Search size={18} />
                </div>
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Search videos..."
                  value={val}
                  onChange={(e) => setVal(e.target.value)}
                />
              </form>
            </div>
            
            {isAdminMode && (
              <button 
                className="social-btn admin-btn" 
                onClick={onOpenAdmin}
                title="Add Video"
              >
                <Plus size={16} style={{ marginRight: '6px' }} />
                Add Video
              </button>
            )}
          </div>

          {/* Mobile Right Controls: Hamburger Menu and Admin buttons */}
          <div className="mobile-controls">
            {isAdminMode && (
              <button 
                className="social-btn admin-btn" 
                onClick={onOpenAdmin}
                title="Add Video"
                style={{ padding: '0 12px', minWidth: '40px', height: '38px', borderRadius: '50%' }}
              >
                <Plus size={16} />
              </button>
            )}
            <button 
              className="menu-toggle-btn" 
              onClick={() => setMenuOpen(!menuOpen)}
              title="Toggle Menu"
              aria-label="Toggle Menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel (Vertical list with icons + Search at bottom) */}
        {menuOpen && (
          <div className="mobile-dropdown-panel">
            {showCategories && categories && (
              <div className="categories-list-mobile">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`mobile-category-row ${activeCategory === category ? 'active' : ''}`}
                    onClick={() => {
                      onSelectCategory(category);
                      setMenuOpen(false); // Close dropdown
                    }}
                  >
                    <span className="mobile-category-icon">
                      {getCategoryIcon(category)}
                    </span>
                    <span className="mobile-category-name">
                      {category === 'All' ? 'All Videos' : category}
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className="search-container-mobile">
              <form className="search-form" onSubmit={handleSubmit}>
                <div className="search-icon">
                  <Search size={18} />
                </div>
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Search videos..."
                  value={val}
                  onChange={(e) => setVal(e.target.value)}
                />
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
