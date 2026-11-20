import { Link } from '@tanstack/react-router'
import { useProfileStore } from '../../stores/profile-store'

export function MyInfoPage() {
  const email = useProfileStore((state) => state.email)
  const nickname = useProfileStore((state) => state.nickname)

  return (
    <main className="mx-auto w-[min(600px,calc(100%-32px))] flex-1 py-16">
      <h1 className="mb-8 text-[32px] font-bold tracking-[-0.04em] text-[#151820]">내 정보</h1>
      <section className="rounded-xl bg-white p-7 shadow-[0_8px_30px_rgba(20,27,39,0.06)]">
        <dl className="space-y-6">
          <div><dt className="text-sm font-bold text-[#737982]">이메일</dt><dd className="mt-2 text-[#171a21]">{email || '입력된 이메일이 없어요.'}</dd></div>
          <div><dt className="text-sm font-bold text-[#737982]">닉네임</dt><dd className="mt-2 text-[#171a21]">{nickname || '입력된 닉네임이 없어요.'}</dd></div>
        </dl>
        <Link className="mt-8 inline-flex h-10 items-center rounded-lg bg-[#2878f0] px-5 text-sm font-bold text-white no-underline" to="/my-info/edit">정보 수정</Link>
      </section>
      <p className="mt-4 text-sm text-[#737982]">입력한 정보는 새로고침 전까지만 유지돼요.</p>
    </main>
  )
}
