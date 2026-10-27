import { Link, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getMovieDetail } from '../../api/movies/get-movie-detail'
import type { TmdbMovieDetail } from '../../api/movies/models'
import { useBookmarkStore } from '../../stores/bookmark-store'
import { getMovieDetailErrorMessage } from '../../utils/movies/get-movie-detail-error-message'
import { getTmdbBackdropUrl, getTmdbPosterUrl } from '../../utils/movies/tmdb-image'

export function MovieDetailPage() {
  const { movieId } = useParams({ from: '/movies/$movieId' })
  const parsedMovieId = Number(movieId)
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0
  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const isBookmarked = useBookmarkStore((state) => state.bookmarkedMovieIds.includes(Number(movieId)))
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark)

  useEffect(() => {
    let ignore = false

    async function loadMovie() {
      setMovie(null)
      setErrorMessage(null)

      if (!Number.isInteger(parsedMovieId) || parsedMovieId <= 0) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const response = await getMovieDetail(parsedMovieId)
        if (!ignore) setMovie(response)
      } catch (error) {
        if (!ignore) setErrorMessage(getMovieDetailErrorMessage(error))
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }

    void loadMovie()
    return () => { ignore = true }
  }, [parsedMovieId, retryCount])

  if (!movie) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-178px)] w-[min(1120px,calc(100%-48px))] flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-[#171a21]" aria-live="polite">
          {!isValidMovieId ? '올바르지 않은 영화 번호예요.' : isLoading ? '영화 정보를 불러오는 중이에요.' : errorMessage}
        </h1>
        {isValidMovieId && !isLoading && errorMessage && (
          <button className="mt-4 cursor-pointer rounded-lg bg-[#2878f0] px-4 py-2 text-white" type="button" onClick={() => setRetryCount((count) => count + 1)}>다시 시도</button>
        )}
        <Link className="mt-6 rounded-lg bg-[#2878f0] px-5 py-3 font-bold text-white no-underline" to="/">
          영화 목록으로
        </Link>
      </main>
    )
  }

  const posterUrl = getTmdbPosterUrl(movie.poster_path)
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path)
  const runtime = typeof movie.runtime === 'number'
    ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
    : '상영 시간 정보가 없어요.'

  return (
    <main className="flex-1 bg-[#f4f6f8]">
      <section className="relative min-h-[260px] overflow-hidden text-white">
        {backdropUrl ? (
          <img className="absolute inset-0 h-full w-full object-cover object-center" src={backdropUrl} alt="" aria-hidden="true" />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-[#737982]">
            <span className="relative z-10">이미지 없음</span>
          </div>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,12,18,0.88)_0%,rgba(9,12,18,0.62)_52%,rgba(9,12,18,0.3)_100%)]" />
        <div className="relative mx-auto flex min-h-[260px] w-[min(1120px,calc(100%-48px))] flex-col justify-end py-9 max-[720px]:w-[calc(100%-32px)]">
          <Link className="mb-7 inline-flex w-fit items-center gap-2 text-sm font-semibold text-white no-underline" to="/">
            <img className="size-4 brightness-0 invert" src="/icons/chevron-left.svg" alt="" />
            영화 목록
          </Link>
          <h1 className="text-[38px] leading-tight font-extrabold tracking-[-0.04em] max-[480px]:text-[30px]">{movie.title}</h1>
          <p className="mt-2 text-sm text-white/75">{movie.original_title}</p>
          <p className="mt-2 text-sm font-semibold text-white/90">
            {movie.release_date} · {movie.genres.map((genre) => genre.name).join(', ')} · {runtime}
          </p>
        </div>
      </section>

      <div className="mx-auto grid w-[min(1120px,calc(100%-48px))] grid-cols-1 gap-8 py-10 lg:grid-cols-[1fr_280px] max-[720px]:w-[calc(100%-32px)]">
        <section className="flex flex-col gap-8 rounded-xl bg-white p-7 shadow-[0_8px_30px_rgba(20,27,39,0.06)] sm:flex-row max-[480px]:p-5">
          {posterUrl ? (
            <img className="aspect-2/3 w-full shrink-0 rounded-lg object-cover sm:w-[190px]" src={posterUrl} alt={`${movie.title} 포스터`} />
          ) : (
            <div className="grid aspect-2/3 w-full shrink-0 place-items-center rounded-lg bg-[#dde1e8] text-[#737982] sm:w-[190px]">이미지 없음</div>
          )}
          <div>
            <h2 className="text-2xl font-bold text-[#171a21]">{movie.tagline}</h2>
            <p className="mt-5 text-[15px] leading-7 text-[#5f6570]">{movie.overview}</p>
            <p className="mt-5 text-sm leading-6 text-[#838994]">
              {movie.title}의 공개 정보를 바탕으로 제공되는 영화 소개입니다.
            </p>
            <button className="mt-6 inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border-0 bg-[#2878f0] px-4 text-sm font-bold text-white" type="button" aria-pressed={isBookmarked} onClick={() => toggleBookmark(movie.id)}>
              <img className="size-4 brightness-0 invert" src={isBookmarked ? '/icons/bookmark.svg' : '/icons/bookmark-outline.svg'} alt="" />
              즐겨찾기
            </button>
          </div>
        </section>

        <aside className="h-fit rounded-xl bg-white p-6 shadow-[0_8px_30px_rgba(20,27,39,0.06)]">
          <h2 className="text-xl font-bold text-[#171a21]">내 평점</h2>
          <div className="mt-4 flex gap-2" aria-label="별점 선택">
            {[1, 2, 3, 4, 5].map((score) => (
              <button className="grid size-9 cursor-pointer place-items-center rounded-md border border-[#e3e6eb] bg-white" type="button" aria-label={`${score}점`} key={score}>
                <img className="size-[18px]" src="/icons/star-outline.svg" alt="" />
              </button>
            ))}
          </div>
          <textarea className="mt-5 min-h-24 w-full resize-none rounded-lg border border-[#dfe3e8] p-3 text-sm outline-none focus:border-[#2878f0]" aria-label="영화 감상평" placeholder="영화에 대한 한줄평을 남겨 보세요." />
          <button className="mt-3 h-10 w-full cursor-pointer rounded-lg border-0 bg-[#171a21] text-sm font-bold text-white" type="button">
            평점 저장
          </button>
        </aside>
      </div>
    </main>
  )
}
