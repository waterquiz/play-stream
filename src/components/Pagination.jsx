import { ChevronLeft, ChevronRight } from 'lucide-react';

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="pagination-bar">
      <button 
        className="pagination-btn" 
        onClick={handlePrev}
        disabled={currentPage === 1}
        title="Previous Page"
        aria-label="Previous Page"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="pagination-numbers">
        {pages.map((num) => (
          <button
            key={num}
            className={`pagination-number-btn ${currentPage === num ? 'active' : ''}`}
            onClick={() => onPageChange(num)}
            aria-label={`Page ${num}`}
            aria-current={currentPage === num ? 'page' : undefined}
          >
            {num}
          </button>
        ))}
      </div>

      <button 
        className="pagination-btn" 
        onClick={handleNext}
        disabled={currentPage === totalPages}
        title="Next Page"
        aria-label="Next Page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

export default Pagination;
