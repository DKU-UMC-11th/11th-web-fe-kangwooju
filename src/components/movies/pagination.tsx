import { cn } from '../../utils/cn'

interface PaginationProps {
  currentPage: number
  onPageChange: (page: number) => void
}

const pages = [1, 2, 3, 4, 5]
const buttonClassName = 'grid size-9 cursor-pointer place-items-center rounded-[7px] border border-transparent bg-transparent text-sm font-semibold text-[#717782] disabled:cursor-default disabled:opacity-35'

export function Pagination({ currentPage, onPageChange }: PaginationProps) {
  return (
    <nav className="mt-12 flex justify-center gap-2" aria-label="영화 목록 페이지">
      <button
        className={buttonClassName}
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <img className="size-4" src="/icons/chevron-left.svg" alt="" />
      </button>

      {pages.map((page) => (
        <button
          className={cn(
            buttonClassName,
            currentPage === page && 'border-[#2878f0] bg-[#2878f0] text-white',
          )}
          type="button"
          aria-current={currentPage === page ? 'page' : undefined}
          key={page}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className={buttonClassName}
        type="button"
        aria-label="다음 페이지"
        disabled={currentPage === pages.length}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <img className="size-4" src="/icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  )
}
