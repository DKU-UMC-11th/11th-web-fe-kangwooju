import { Link, useRouterState } from '@tanstack/react-router'
import { cn } from '../../utils/cn'

const navClassName = 'relative flex h-full items-center text-sm font-semibold after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:rounded-t-sm after:bg-[#171a21] after:transition-opacity'

export function Header() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const isMovieRoute = pathname === '/' || pathname.startsWith('/movies/')
  const isSearchRoute = pathname === '/search'

  return (
    <header className="border-b border-[#eceff3] bg-white">
      <div className="mx-auto flex h-[72px] w-[min(1120px,calc(100%-48px))] items-center max-[720px]:w-[calc(100%-32px)] max-[480px]:h-auto max-[480px]:flex-wrap max-[480px]:pt-3.5">
        <Link
          className="inline-flex items-center gap-2 text-[17px] font-extrabold tracking-[-0.03em] text-[#16191f] no-underline"
          to="/"
          aria-label="UMCine 홈"
        >
          <span className="grid size-[30px] place-items-center rounded-lg border-2 border-[#16191f]">
            <img className="size-[18px]" src="/icons/movie.svg" alt="" />
          </span>
          <span>UMCine</span>
        </Link>

        <nav className="ml-12 flex h-full items-center gap-8 max-[720px]:ml-6 max-[720px]:gap-[18px] max-[480px]:order-3 max-[480px]:ml-0 max-[480px]:h-12 max-[480px]:w-full" aria-label="주요 메뉴">
          <Link
            className={cn(
              navClassName,
              isMovieRoute
                ? 'text-[#171a21] after:opacity-100'
                : 'text-[#737982] after:opacity-0',
            )}
            to="/"
          >
            영화
          </Link>
          <Link
            className={cn(
              navClassName,
              isSearchRoute
                ? 'text-[#171a21] after:opacity-100'
                : 'text-[#737982] after:opacity-0',
            )}
            to="/search"
          >
            검색
          </Link>
          <span className={cn(navClassName, 'text-[#737982] after:opacity-0')}>내 정보</span>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            className="grid size-[38px] place-items-center rounded-lg border border-[#e6e9ee] bg-white focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-blue-300"
            to="/search"
            aria-label="영화 검색"
          >
            <img className="size-[18px]" src="/icons/search.svg" alt="" />
          </Link>
          <button className="h-[38px] rounded-[7px] border-0 bg-[#2878f0] px-[18px] text-sm font-bold text-white" type="button">
            로그인
          </button>
        </div>
      </div>
    </header>
  )
}
