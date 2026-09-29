import { useState } from 'react'
import { MovieGrid } from '../../components/movies/movie-grid'
import { Pagination } from '../../components/movies/pagination'
import { movies as initialMovies } from '../../data/movies'

export function MovieListPage() {
  const [movies, setMovies] = useState(initialMovies)
  const [currentPage, setCurrentPage] = useState(1)

  const handleToggleBookmark = (movieId: number) => {
    setMovies((currentMovies) => currentMovies.map((movie) => (
      movie.id === movieId
        ? { ...movie, isBookmarked: !movie.isBookmarked }
        : movie
    )))
  }

  return (
    <main className="mx-auto w-[min(1120px,calc(100%-48px))] flex-1 py-12 max-[720px]:w-[calc(100%-32px)] max-[480px]:py-8">
      <h1 className="mb-6 text-[32px] leading-tight font-bold tracking-[-0.04em] text-[#151820] max-[480px]:text-[27px]">
        영화 목록
      </h1>
      <MovieGrid
        movies={movies}
        onToggleBookmark={handleToggleBookmark}
      />
      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </main>
  )
}
