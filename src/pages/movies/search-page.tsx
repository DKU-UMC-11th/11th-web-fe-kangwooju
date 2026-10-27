import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useState, type FormEvent } from 'react'
import { searchMovies } from '../../api/movies/search-movies'
import type { TmdbMovieListItem } from '../../api/movies/models'
import { BookmarkButton } from '../../components/movies/bookmark-button'
import { Pagination } from '../../components/movies/pagination'
import { toMovieCard } from '../../utils/movies/to-movie-card'
import { cn } from '../../utils/cn'

export function SearchPage() {
  const { query, page = 1 } = useSearch({ from: '/search' })
  const navigate = useNavigate({ from: '/search' })

  const normalizedQuery = query?.trim() ?? ''
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const searchResults = movies.map(toMovieCard)

  useEffect(() => {
    let ignore = false

    function loadSearchResults() {
      setMovies([])
      setErrorMessage(null)
      setTotalResults(0)
      setTotalPages(0)

      if (!normalizedQuery) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      return searchMovies({ query: normalizedQuery, page })
        .then((response) => {
          if (!ignore) {
            setMovies(response.results)
            setTotalPages(response.total_pages)
            setTotalResults(response.total_results)
          }
        })
        .catch(() => {
          if (!ignore) setErrorMessage('검색 결과를 불러오지 못했어요.')
        })
        .finally(() => {
          if (!ignore) setIsLoading(false)
        })
    }

    void loadSearchResults()
    return () => { ignore = true }
  }, [normalizedQuery, page, retryCount])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextQuery = String(new FormData(event.currentTarget).get('query') ?? '').trim()

    navigate({
      search: nextQuery ? { query: nextQuery, page: 1 } : {},
    })
  }

  return (
    <main
      className={cn(
        'mx-auto w-[min(1120px,calc(100%-48px))] flex-1 py-12 max-[720px]:w-[calc(100%-32px)]',
        !normalizedQuery && 'flex min-h-[calc(100vh-178px)] items-start justify-center pt-[15vh]',
      )}
    >
      <div className={cn('w-full', !normalizedQuery && 'max-w-[800px]')}>
        <h1
          className={cn(
            'mb-6 text-[32px] leading-tight font-bold tracking-[-0.04em] text-[#151820] max-[480px]:text-[27px]',
            !normalizedQuery && 'text-center text-[36px] max-[480px]:text-[28px]',
          )}
        >
          {normalizedQuery ? '영화 검색' : '어떤 영화를 찾고 있나요?'}
        </h1>

        <form className="flex h-14 items-center gap-3 rounded-[9px] border border-[#b5bac2] bg-white px-4 shadow-[0_8px_22px_rgba(20,27,39,0.08)] focus-within:border-[#2878f0]" onSubmit={handleSubmit}>
          <img className="size-[18px] opacity-60" src="/icons/search.svg" alt="" />
          <input
            key={query}
            className="min-w-0 flex-1 border-0 bg-transparent text-[15px] text-[#171a21] outline-none placeholder:text-[#a4a9b1]"
            aria-label="검색어"
            name="query"
            placeholder="예: 스파이더맨"
            defaultValue={query ?? ''}
          />
          <button className="h-9 cursor-pointer rounded-md border-0 bg-[#171a21] px-5 text-sm font-bold text-white" type="submit">
            검색
          </button>
        </form>

        {normalizedQuery && (
          <section className="mt-8" aria-live="polite" aria-busy={isLoading}>
            <h2 className="text-xl font-bold text-[#171a21]">‘{query?.trim()}’ 검색 결과</h2>
            {!isLoading && !errorMessage && <p className="mt-2 text-sm text-[#737982]">영화 {totalResults}편</p>}

            {isLoading ? <p className="mt-8">검색 결과를 불러오는 중이에요.</p> : errorMessage ? (
              <div className="mt-8" role="alert">
                <p>{errorMessage}</p>
                <button className="mt-4 cursor-pointer rounded-lg bg-[#2878f0] px-4 py-2 text-white" type="button" onClick={() => setRetryCount((count) => count + 1)}>다시 시도</button>
              </div>
            ) : searchResults.length === 0 ? (
              <p className="mt-16 text-center text-[#737982]">검색 결과가 없어요.</p>
            ) : (
              <ul className="mt-6 grid list-none grid-cols-1 gap-x-12 gap-y-8 p-0 lg:grid-cols-2">
                {searchResults.map((movie) => (
                  <li className="grid grid-cols-[112px_1fr] gap-5 border-b border-[#e4e7eb] pb-8 max-[480px]:grid-cols-[88px_1fr]" key={movie.id}>
                    <div className="relative">
                      <Link
                        className="block overflow-hidden rounded-lg"
                        to="/movies/$movieId"
                        params={{ movieId: String(movie.id) }}
                      >
                        {movie.posterPath ? (
                          <img className="aspect-2/3 h-full w-full object-cover" src={movie.posterPath} alt={`${movie.title} 포스터`} />
                        ) : (
                          <span className="grid aspect-2/3 place-items-center bg-[#dde1e8] text-sm text-[#737982]">이미지 없음</span>
                        )}
                      </Link>
                      <BookmarkButton
                        movieId={movie.id}
                        movieTitle={movie.title}
                      />
                    </div>
                    <div className="min-w-0 py-1">
                      <Link
                        className="text-lg font-bold text-[#171a21] no-underline"
                        to="/movies/$movieId"
                        params={{ movieId: String(movie.id) }}
                      >
                        {movie.title}
                      </Link>
                      <p className="mt-1 text-xs text-[#9298a1]">{movie.originalTitle} · {movie.releaseDate}</p>
                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#5f6570]">{movie.overview}</p>
                      <Link
                        className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#2878f0] no-underline"
                        to="/movies/$movieId"
                        params={{ movieId: String(movie.id) }}
                      >
                        상세 보기 <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {!isLoading && !errorMessage && totalPages > 0 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(nextPage) => { void navigate({ search: { query, page: nextPage } }) }}
              />
            )}
          </section>
        )}
      </div>
    </main>
  )
}
