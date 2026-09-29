import { Link } from '@tanstack/react-router'
import type { Movie } from '../../types/movie'
import { cn } from '../../utils/cn'

interface MovieCardProps {
  movie: Movie
  onToggleBookmark: (movieId: number) => void
}

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="min-w-0">
      <div className="group relative aspect-2/3 overflow-hidden rounded-lg bg-[#dde1e8]">
        <Link
          className="block h-full focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-blue-300"
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          <img
            className="block h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
        </Link>
        <button
          className={cn(
            'absolute top-2.5 right-2.5 grid size-[34px] cursor-pointer place-items-center rounded-[7px] border border-white/75 backdrop-blur-sm focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-blue-300',
            movie.isBookmarked ? 'bg-[#2f80ed]' : 'bg-[#10141cd1]',
          )}
          type="button"
          aria-label={`${movie.title} 북마크 ${movie.isBookmarked ? '해제' : '추가'}`}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            className="size-[18px]"
            src={movie.isBookmarked ? '/icons/bookmark.svg' : '/icons/bookmark-outline.svg'}
            alt=""
          />
        </button>
      </div>

      <Link
        className="mt-3 block truncate text-[15px] leading-[1.4] font-bold text-[#1b1e25] no-underline"
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
      >
        {movie.title}
      </Link>
      <p className="m-0 mt-1 text-xs leading-6 text-[#9298a1]">{movie.releaseDate}</p>
    </article>
  )
}
