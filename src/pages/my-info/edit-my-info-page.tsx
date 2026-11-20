import { Link, useNavigate } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'
import { useProfileStore } from '../../stores/profile-store'
import { isValidEmail, isValidNickname } from '../../utils/auth/signup-validation'

const inputClass = 'h-12 w-full rounded-lg border border-[#dfe3e8] bg-white px-4 text-sm text-[#171a21] outline-none focus:border-[#2878f0]'

export function EditMyInfoPage() {
  const navigate = useNavigate()
  const storedEmail = useProfileStore((state) => state.email)
  const storedNickname = useProfileStore((state) => state.nickname)
  const setProfile = useProfileStore((state) => state.setProfile)
  const [email, setEmail] = useState(storedEmail)
  const [nickname, setNickname] = useState(storedNickname)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isValidEmail(email) || !isValidNickname(nickname)) return
    setProfile({ email: email.trim(), nickname: nickname.trim() })
    void navigate({ to: '/my-info' })
  }

  return (
    <main className="mx-auto w-[min(600px,calc(100%-32px))] flex-1 py-16">
      <h1 className="mb-8 text-[32px] font-bold tracking-[-0.04em] text-[#151820]">내 정보 수정</h1>
      <form className="space-y-5 rounded-xl bg-white p-7 shadow-[0_8px_30px_rgba(20,27,39,0.06)]" onSubmit={handleSubmit} noValidate>
        <div>
          <label className="mb-2 block text-sm font-bold" htmlFor="profile-email">이메일</label>
          <input id="profile-email" className={inputClass} type="email" value={email} aria-invalid={email.length > 0 && !isValidEmail(email)} onChange={(event) => setEmail(event.target.value)} />
          {email.length > 0 && !isValidEmail(email) && <p className="mt-2 text-xs text-[#e53e3e]">이메일 형식을 확인해 주세요.</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold" htmlFor="profile-nickname">닉네임</label>
          <input id="profile-nickname" className={inputClass} value={nickname} aria-invalid={nickname.length > 0 && !isValidNickname(nickname)} onChange={(event) => setNickname(event.target.value)} />
          {nickname.length > 0 && !isValidNickname(nickname) && <p className="mt-2 text-xs text-[#e53e3e]">닉네임은 2~12자로 입력해 주세요.</p>}
        </div>
        <div className="flex gap-3">
          <button className="h-10 cursor-pointer rounded-lg bg-[#2878f0] px-5 text-sm font-bold text-white disabled:cursor-default disabled:bg-[#a0baf3]" type="submit" disabled={!isValidEmail(email) || !isValidNickname(nickname)}>저장</button>
          <Link className="inline-flex h-10 items-center rounded-lg border border-[#dfe3e8] px-5 text-sm font-bold text-[#5f6570] no-underline" to="/my-info">취소</Link>
        </div>
      </form>
      <p className="mt-4 text-sm text-[#737982]">입력한 정보는 새로고침 전까지만 유지돼요.</p>
    </main>
  )
}
