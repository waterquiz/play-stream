function Categories({ categories, active, onSelect }) {
  return (
    <section className="categories-bar">
      <div className="tags-wrapper">
        {categories.map((category) => (
          <button
            key={category}
            className={`tag-pill ${active === category ? 'active' : ''}`}
            onClick={() => onSelect(category)}
          >
            {category === 'All' ? 'All Videos' : category}
          </button>
        ))}
      </div>
    </section>
  );
}

export default Categories;
