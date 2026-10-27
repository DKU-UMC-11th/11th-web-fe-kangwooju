import { Link } from '@tanstack/react-router'
import type { MovieCardData } from '../../types/movie'
import { BookmarkButton } from './bookmark-button'

interface MovieCardProps {
  movie: MovieCardData
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="min-w-0">
      <div className="group relative aspect-2/3 overflow-hidden rounded-lg bg-[#dde1e8]">
        <Link
          className="block h-full focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-blue-300"
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          {movie.posterPath ? (
            <img
              className="block h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
              src={movie.posterPath}
              alt={`${movie.title} 포스터`}
            />
          ) : (
            <span className="grid h-full place-items-center text-sm text-[#737982]">이미지 없음</span>
          )}
        </Link>
        <BookmarkButton
          movieId={movie.id}
          movieTitle={movie.title}
        />
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
