
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 7;
    const boundaryPages = 1; // first & last
    const adjacentPages = 1; // around current

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      // First page
      pageNumbers.push(1);

      // Ellipsis after first page
      if (currentPage > 2 + adjacentPages) pageNumbers.push('...');

      // Middle pages
      const start = Math.max(2, currentPage - adjacentPages);
      const end = Math.min(totalPages - 1, currentPage + adjacentPages);
      for (let i = start; i <= end; i++) pageNumbers.push(i);

      // Ellipsis before last page
      if (currentPage < totalPages - (1 + adjacentPages)) pageNumbers.push('...');

      // Last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const pages = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center mt-8 space-x-1" aria-label="Pagination">
      {/* Prev */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-10 h-10 flex justify-center items-center rounded-md ${
          currentPage === 1
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
        aria-label="Previous page"
      >
        ‹
      </button>

      {/* Page numbers */}
      {pages.map((page, idx) =>
        page === '...' ? (
          <span
            key={`ellipsis-${idx}`}
            className="w-10 h-10 flex justify-center items-center text-gray-500"
          >
            {page}
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 flex justify-center items-center rounded-md mx-0.5 text-sm sm:text-base transition ${
              page === currentPage
                ? 'bg-red-600 text-white font-bold shadow-md'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-10 h-10 flex justify-center items-center rounded-md ${
          currentPage === totalPages
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  );
};

export default Pagination;
