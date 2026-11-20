import { Link } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'

const inputClass = 'h-12 w-full rounded-lg border border-[#dfe3e8] bg-white px-4 text-sm text-[#171a21] outline-none placeholder:text-[#a4a9b1] focus:border-[#2878f0]'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('로그인 기능은 아직 제공되지 않아요.')
  }

  return (
    <main className="mx-auto flex w-[min(440px,calc(100%-32px))] flex-1 flex-col justify-center py-16">
      <h1 className="mb-8 text-[32px] font-bold tracking-[-0.04em] text-[#151820]">로그인</h1>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-bold" htmlFor="login-email">이메일</label>
          <input id="login-email" className={inputClass} type="email" autoComplete="email" placeholder="이메일" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold" htmlFor="login-password">비밀번호</label>
          <input id="login-password" className={inputClass} type="password" autoComplete="current-password" placeholder="비밀번호" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        <button className="h-12 w-full cursor-pointer rounded-lg bg-[#2878f0] text-sm font-bold text-white disabled:cursor-default disabled:bg-[#a0baf3]" type="submit" disabled={!email.trim() || !password}>로그인</button>
        {message && <p className="text-sm text-[#737982]" role="status">{message}</p>}
      </form>
      <p className="mt-6 text-center text-sm text-[#9298a1]">아직 계정이 없나요? <Link className="font-bold text-[#2878f0] no-underline" to="/signup">회원가입</Link></p>
    </main>
  )
}
