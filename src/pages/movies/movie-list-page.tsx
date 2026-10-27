import { useEffect, useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { getMovies } from '../../api/movies/get-movies'
import type { TmdbMovieListItem } from '../../api/movies/models'
import { MovieGrid } from '../../components/movies/movie-grid'
import { Pagination } from '../../components/movies/pagination'
import { toMovieCard } from '../../utils/movies/to-movie-card'

export function MovieListPage() {
  const { page = 1 } = useSearch({ from: '/' })
  const navigate = useNavigate({ from: '/' })
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let ignore = false

    async function loadMovies() {
      setIsLoading(true)
      setErrorMessage(null)
      setMovies([])

      try {
        const response = await getMovies({ page })
        if (!ignore) {
          setMovies(response.results)
          setTotalPages(response.total_pages)
        }
      } catch {
        if (!ignore) setErrorMessage('영화 목록을 불러오지 못했어요.')
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }

    void loadMovies()
    return () => { ignore = true }
  }, [page, retryCount])

  return (
    <main className="mx-auto w-[min(1120px,calc(100%-48px))] flex-1 py-12 max-[720px]:w-[calc(100%-32px)] max-[480px]:py-8">
      <h1 className="mb-6 text-[32px] leading-tight font-bold tracking-[-0.04em] text-[#151820] max-[480px]:text-[27px]">
        영화 목록
      </h1>
      <section aria-live="polite" aria-busy={isLoading}>
        {isLoading ? <p>영화 목록을 불러오는 중이에요.</p> : errorMessage ? (
          <div role="alert">
            <p>{errorMessage}</p>
            <button className="mt-4 cursor-pointer rounded-lg bg-[#2878f0] px-4 py-2 text-white" type="button" onClick={() => setRetryCount((count) => count + 1)}>다시 시도</button>
          </div>
        ) : movies.length === 0 ? <p>조건에 맞는 영화가 없어요.</p> : (
          <MovieGrid movies={movies.map(toMovieCard)} />
        )}
      </section>
      {!isLoading && !errorMessage && totalPages > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(nextPage) => { void navigate({ search: { page: nextPage } }) }}
        />
      )}
    </main>
  )
}
