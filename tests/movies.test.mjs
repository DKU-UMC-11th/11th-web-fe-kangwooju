import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { registerHooks } from 'node:module'
import test from 'node:test'

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('.') && !specifier.match(/\.[a-z]+$/)) {
      return nextResolve(`${specifier}.ts`, context)
    }
    return nextResolve(specifier, context)
  },
  load(url, context, nextLoad) {
    if (url.endsWith('/src/config/env.ts')) {
      return {
        format: 'module-typescript',
        source: readFileSync(new URL(url), 'utf8').replaceAll('import.meta.env', '({})'),
        shortCircuit: true,
      }
    }
    return nextLoad(url, context)
  },
})

const { parsePage } = await import('../src/utils/movies/parse-page.ts')
const { toMovieCard } = await import('../src/utils/movies/to-movie-card.ts')
const { getTmdbPosterUrl, getTmdbBackdropUrl } = await import('../src/utils/movies/tmdb-image.ts')
const { getMovieDetailErrorMessage } = await import('../src/utils/movies/get-movie-detail-error-message.ts')
const { env } = await import('../src/config/env.ts')
env.tmdbAccessToken = 'test-token'
const { getMoviesWithFetch } = await import('../src/api/movies/get-movies-with-fetch.ts')
const { getMovies } = await import('../src/api/movies/get-movies.ts')
const { searchMovies } = await import('../src/api/movies/search-movies.ts')
const { getMovieDetail } = await import('../src/api/movies/get-movie-detail.ts')

test('URL page accepts only TMDB pages 1–500', () => {
  for (const value of [undefined, null, '', [], {}, true, 'abc', '-1', '0', '1.5', '501', Infinity]) {
    assert.equal(parsePage(value), 1)
  }
  assert.equal(parsePage('25'), 25)
  assert.equal(parsePage(500), 500)
})

test('card adapter preserves IDs and handles absent images', () => {
  const source = {
    id: 27205, title: '인셉션', original_title: 'Inception', release_date: '2010-07-15',
    overview: '꿈속으로', poster_path: null,
  }
  assert.deepEqual(toMovieCard(source), {
    id: 27205, title: '인셉션', originalTitle: 'Inception', releaseDate: '2010-07-15',
    overview: '꿈속으로', posterPath: null,
  })
  assert.equal(getTmdbPosterUrl('/poster.jpg'), 'https://image.tmdb.org/t/p/w500/poster.jpg')
  assert.equal(getTmdbBackdropUrl('/backdrop.jpg'), 'https://image.tmdb.org/t/p/w1280/backdrop.jpg')
  assert.equal(getTmdbBackdropUrl(null), null)
  assert.equal(getTmdbPosterUrl(''), null)
})

test('fetch and ky use the contract, reject missing credentials and HTTP errors', async () => {
  const originalFetch = globalThis.fetch
  const requests = []
  let status = 200
  env.tmdbAccessToken = ''
  await assert.rejects(getMoviesWithFetch(), /TMDB 환경 변수가 필요해요/)
  await assert.rejects(getMovies(), /TMDB 환경 변수가 필요해요/)

  env.tmdbAccessToken = 'test-token'
  globalThis.fetch = async (input, options) => {
    const request = input instanceof Request ? input : new Request(input, options)
    requests.push(request)
    return Response.json({ page: 2, results: [], total_pages: 3, total_results: 0 }, { status })
  }

  try {
    await getMoviesWithFetch(2)
    assert.equal(requests.at(-1).headers.get('Authorization'), 'Bearer test-token')
    assert.equal(new URL(requests.at(-1).url).searchParams.get('page'), '2')
    await getMovies({ page: 2 })
    assert.equal(requests.at(-1).headers.get('Authorization'), 'Bearer test-token')
    assert.equal(new URL(requests.at(-1).url).pathname, '/3/movie/popular')
    await searchMovies({ query: '인셉션 & 꿈', page: 2 })
    const searchUrl = new URL(requests.at(-1).url)
    assert.equal(searchUrl.searchParams.get('query'), '인셉션 & 꿈')
    assert.equal(searchUrl.searchParams.get('include_adult'), 'false')
    assert.equal(searchUrl.searchParams.get('language'), 'ko-KR')
    await getMovieDetail(27205)
    assert.equal(new URL(requests.at(-1).url).pathname, '/3/movie/27205')

    status = 404
    await assert.rejects(getMoviesWithFetch(), /영화 목록 요청에 실패했어요: 404/)
    await assert.rejects(getMovieDetail(999999999), (error) => {
      assert.equal(getMovieDetailErrorMessage(error), '영화를 찾을 수 없어요.')
      return true
    })
    status = 401
    await assert.rejects(getMovies(), (error) => {
      assert.equal(error.response.status, 401)
      assert.equal(getMovieDetailErrorMessage(error), '영화 정보를 불러오지 못했어요.')
      return true
    })
    globalThis.fetch = async () => { throw new TypeError('Failed to fetch') }
    await assert.rejects(getMoviesWithFetch(), /Failed to fetch/)
  } finally {
    globalThis.fetch = originalFetch
    env.tmdbAccessToken = ''
  }
})
