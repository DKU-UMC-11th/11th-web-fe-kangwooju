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

const { isValidEmail, isValidNickname, isValidPassword } = await import('../src/utils/auth/signup-validation.ts')
const { checkEmailDuplicate } = await import('../src/api/members/check-email-duplicate.ts')
const { checkNicknameDuplicate } = await import('../src/api/members/check-nickname-duplicate.ts')
const { signup } = await import('../src/api/members/signup.ts')

test('validates signup fields and keeps regular expressions stateless', () => {
  for (let index = 0; index < 3; index += 1) {
    assert.equal(isValidEmail(' test@example.com '), true)
    assert.equal(isValidEmail('test@'), false)
    assert.equal(isValidNickname('가'), false)
    assert.equal(isValidNickname(' 가나다 '), true)
    assert.equal(isValidNickname('가'.repeat(13)), false)
    assert.equal(isValidPassword('Abcdef1!'), true)
    assert.equal(isValidPassword('abcdef1!'), false)
    assert.equal(isValidPassword('ABCDEF1!'), false)
    assert.equal(isValidPassword('Abcdefgh!'), false)
    assert.equal(isValidPassword('Abcdef12'), false)
    assert.equal(isValidPassword('Abcd1!'), false)
  }
})

test('member APIs encode values, send the specified body, and surface HTTP errors', async () => {
  const originalFetch = globalThis.fetch
  const requests = []
  let status = 200
  globalThis.fetch = async (input, options) => {
    const request = input instanceof Request ? input : new Request(input, options)
    requests.push(request.clone())
    return Response.json({ available: true, isSuccess: true, code: 'OK', message: '가입 완료', result: { memberId: 1, email: 'test@example.com', nickname: '영화 팬' } }, { status })
  }

  try {
    assert.equal((await checkEmailDuplicate('test+one@example.com')).available, true)
    assert.equal(new URL(requests.at(-1).url).pathname, '/members/email/test%2Bone%40example.com')
    assert.equal((await checkNicknameDuplicate('영화 팬')).available, true)
    assert.equal(decodeURIComponent(new URL(requests.at(-1).url).pathname), '/members/nickname/영화 팬')
    const body = { email: 'test@example.com', nickname: '영화 팬', password: 'Abcdef1!' }
    assert.equal((await signup(body)).isSuccess, true)
    assert.equal(requests.at(-1).method, 'POST')
    assert.deepEqual(await requests.at(-1).clone().json(), body)
    status = 409
    await assert.rejects(signup(body), (error) => error.response.status === 409)
  } finally {
    globalThis.fetch = originalFetch
  }
})
