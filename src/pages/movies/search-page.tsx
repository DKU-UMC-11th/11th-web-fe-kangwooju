import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import type { FormEvent } from 'react'
import { movies } from '../../data/movies'
import { cn } from '../../utils/cn'

export function SearchPage() {
  const { query } = useSearch({ from: '/search' })
  const navigate = useNavigate({ from: '/search' })

  const normalizedQuery = query?.trim().toLowerCase() ?? ''
  const searchResults = normalizedQuery
    ? movies.filter((movie) => (
        movie.title.toLowerCase().includes(normalizedQuery)
        || movie.originalTitle.toLowerCase().includes(normalizedQuery)
      ))
    : []

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextQuery = String(new FormData(event.currentTarget).get('query') ?? '').trim()

    navigate({
      search: nextQuery ? { query: nextQuery } : {},
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
          <section className="mt-8" aria-live="polite">
            <h2 className="text-xl font-bold text-[#171a21]">‘{query?.trim()}’ 검색 결과</h2>
            <p className="mt-2 text-sm text-[#737982]">영화 {searchResults.length}편</p>

            {searchResults.length === 0 ? (
              <p className="mt-16 text-center text-[#737982]">검색 결과가 없어요.</p>
            ) : (
              <ul className="mt-6 grid list-none grid-cols-1 gap-x-12 gap-y-8 p-0 lg:grid-cols-2">
                {searchResults.map((movie) => (
                  <li className="grid grid-cols-[112px_1fr] gap-5 border-b border-[#e4e7eb] pb-8 max-[480px]:grid-cols-[88px_1fr]" key={movie.id}>
                    <Link
                      className="block overflow-hidden rounded-lg"
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                    >
                      <img className="aspect-2/3 h-full w-full object-cover" src={movie.posterPath} alt={`${movie.title} 포스터`} />
                    </Link>
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
          </section>
        )}
      </div>
    </main>
  )
}
