export const env = {
  tmdbApiBaseUrl: import.meta.env.VITE_TMDB_API_BASE_URL || 'https://api.themoviedb.org/3',
  tmdbAccessToken: import.meta.env.VITE_TMDB_ACCESS_TOKEN || '',
}

export function requireTmdbToken() {
  if (!env.tmdbAccessToken.trim()) {
    throw new Error('TMDB 환경 변수가 필요해요. .env.local의 VITE_TMDB_ACCESS_TOKEN을 확인해 주세요.')
  }
}
