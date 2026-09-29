interface PaginationProps {
  currentPage: number
  onPageChange: (page: number) => void
}

const pages = [1, 2, 3, 4, 5]

export function Pagination({ currentPage, onPageChange }: PaginationProps) {
  return (
    <nav className="pagination" aria-label="영화 목록 페이지">
      <button
        className="pagination-arrow"
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <img src="/icons/chevron-left.svg" alt="" />
      </button>

      {pages.map((page) => (
        <button
          className={currentPage === page ? 'active' : ''}
          type="button"
          aria-current={currentPage === page ? 'page' : undefined}
          key={page}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="pagination-arrow"
        type="button"
        aria-label="다음 페이지"
        disabled={currentPage === pages.length}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <img src="/icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  )
}
