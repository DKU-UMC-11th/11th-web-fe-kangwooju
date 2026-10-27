import type { MovieCardData } from '../../types/movie'
import { MovieCard } from './movie-card'

interface MovieGridProps {
  movies: MovieCardData[]
}

export function MovieGrid({ movies }: MovieGridProps) {
  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-8 min-[480px]:grid-cols-2 min-[720px]:grid-cols-3 min-[1000px]:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
        />
      ))}
    </div>
  )
}
