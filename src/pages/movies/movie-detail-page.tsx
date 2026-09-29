import { Link, useParams } from '@tanstack/react-router'
import { movies } from '../../data/movies'

export function MovieDetailPage() {
  const { movieId } = useParams({ from: '/movies/$movieId' })
  const movie = movies.find((item) => item.id === Number(movieId))

  if (!movie) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-178px)] w-[min(1120px,calc(100%-48px))] flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-[#171a21]">영화를 찾을 수 없어요.</h1>
        <Link className="mt-6 rounded-lg bg-[#2878f0] px-5 py-3 font-bold text-white no-underline" to="/">
          영화 목록으로
        </Link>
      </main>
    )
  }

  return (
    <main className="flex-1 bg-[#f4f6f8]">
      <section className="relative min-h-[260px] overflow-hidden text-white">
        <img className="absolute inset-0 h-full w-full object-cover object-center" src={movie.backdropPath} alt="" aria-hidden="true" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,12,18,0.88)_0%,rgba(9,12,18,0.62)_52%,rgba(9,12,18,0.3)_100%)]" />
        <div className="relative mx-auto flex min-h-[260px] w-[min(1120px,calc(100%-48px))] flex-col justify-end py-9 max-[720px]:w-[calc(100%-32px)]">
          <Link className="mb-7 inline-flex w-fit items-center gap-2 text-sm font-semibold text-white no-underline" to="/">
            <img className="size-4 brightness-0 invert" src="/icons/chevron-left.svg" alt="" />
            영화 목록
          </Link>
          <h1 className="text-[38px] leading-tight font-extrabold tracking-[-0.04em] max-[480px]:text-[30px]">{movie.title}</h1>
          <p className="mt-2 text-sm text-white/75">{movie.originalTitle}</p>
          <p className="mt-2 text-sm font-semibold text-white/90">
            {movie.releaseDate} · {movie.genres.join(' · ')} · {movie.runtime}
          </p>
        </div>
      </section>

      <div className="mx-auto grid w-[min(1120px,calc(100%-48px))] grid-cols-1 gap-8 py-10 lg:grid-cols-[1fr_280px] max-[720px]:w-[calc(100%-32px)]">
        <section className="flex flex-col gap-8 rounded-xl bg-white p-7 shadow-[0_8px_30px_rgba(20,27,39,0.06)] sm:flex-row max-[480px]:p-5">
          <img className="w-full shrink-0 rounded-lg object-cover sm:w-[190px]" src={movie.posterPath} alt={`${movie.title} 포스터`} />
          <div>
            <h2 className="text-2xl font-bold text-[#171a21]">{movie.tagline}</h2>
            <p className="mt-5 text-[15px] leading-7 text-[#5f6570]">{movie.overview}</p>
            <p className="mt-5 text-sm leading-6 text-[#838994]">
              {movie.title}의 공개 정보를 바탕으로 제공되는 영화 소개입니다.
            </p>
            <button className="mt-6 inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border-0 bg-[#2878f0] px-4 text-sm font-bold text-white" type="button">
              <img className="size-4 brightness-0 invert" src={movie.isBookmarked ? '/icons/bookmark.svg' : '/icons/bookmark-outline.svg'} alt="" />
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
