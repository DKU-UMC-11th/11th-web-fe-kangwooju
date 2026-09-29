import { useState } from 'react'
import { Header } from './components/header'
import { MovieGrid } from './components/movie-grid'
import { Pagination } from './components/pagination'
import { movies as initialMovies } from './data/movies'
import './App.css'

export default function App() {
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
    <div id="top" className="app">
      <Header />

      <main id="movies" className="content">
        <h1>영화 목록</h1>
        <MovieGrid
          movies={movies}
          onToggleBookmark={handleToggleBookmark}
        />
        <Pagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <img src="/images/logos/tmdb-logo.svg" alt="TMDB" />
          <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
        </div>
      </footer>
    </div>
  )
}
