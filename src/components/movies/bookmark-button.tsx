import { useBookmarkStore } from '../../stores/bookmark-store'
import { cn } from '../../utils/cn'

interface BookmarkButtonProps {
  movieId: number
  movieTitle: string
}

export function BookmarkButton({ movieId, movieTitle }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) => state.bookmarkedMovieIds.includes(movieId))
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark)

  return (
    <button
      className={cn(
        'absolute top-2.5 right-2.5 grid size-[34px] cursor-pointer place-items-center rounded-[7px] border border-white/75 backdrop-blur-sm focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-blue-300',
        isBookmarked ? 'bg-[#2f80ed]' : 'bg-[#10141cd1]',
      )}
      type="button"
      aria-label={`${movieTitle} 북마크 ${isBookmarked ? '해제' : '추가'}`}
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
    >
      <img
        className="size-[18px]"
        src={isBookmarked ? '/icons/bookmark.svg' : '/icons/bookmark-outline.svg'}
        alt=""
      />
    </button>
  )
}
