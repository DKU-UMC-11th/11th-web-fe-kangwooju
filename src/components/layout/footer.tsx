export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#e7eaf0] bg-white py-6">
      <div className="mx-auto flex w-[min(1120px,calc(100%-48px))] items-center justify-center gap-3 max-[720px]:w-[calc(100%-32px)] max-[480px]:items-start max-[480px]:flex-col">
        <img className="w-[52px]" src="/images/logos/tmdb-logo.svg" alt="TMDB" />
        <p className="m-0 text-[11px] text-[#9a9fa8]">
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
      </div>
    </footer>
  )
}
