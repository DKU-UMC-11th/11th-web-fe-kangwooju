import { Link } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'
import { checkEmailDuplicate } from '../../api/members/check-email-duplicate'
import { checkNicknameDuplicate } from '../../api/members/check-nickname-duplicate'
import { signup } from '../../api/members/signup'
import { isValidEmail, isValidNickname, isValidPassword } from '../../utils/auth/signup-validation'

const inputClass = 'h-12 w-full rounded-lg border border-[#dfe3e8] bg-white px-4 text-sm text-[#171a21] outline-none placeholder:text-[#a4a9b1] focus:border-[#2878f0] disabled:bg-[#f4f6f8]'
const labelClass = 'mb-2 block text-sm font-bold text-[#171a21]'
const errorClass = 'mt-2 text-xs text-[#e53e3e]'
const initialForm = { email: '', nickname: '', password: '', passwordConfirm: '' }
type FormKey = keyof typeof initialForm
type CheckKey = 'email' | 'nickname'
type CheckState = { isChecking: boolean; isAvailable: boolean }
const initialCheck: CheckState = { isChecking: false, isAvailable: false }

export function SignupPage() {
  const [form, setForm] = useState(initialForm)
  const [checks, setChecks] = useState({ email: initialCheck, nickname: initialCheck })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const emailValid = isValidEmail(form.email)
  const nicknameValid = isValidNickname(form.nickname)
  const passwordValid = isValidPassword(form.password)
  const confirmValid = form.passwordConfirm.length > 0 && form.password === form.passwordConfirm
  const canSubmit = emailValid && nicknameValid && passwordValid && confirmValid
    && checks.email.isAvailable && checks.nickname.isAvailable
    && !checks.email.isChecking && !checks.nickname.isChecking

  function changeField(key: FormKey, value: string) {
    if ((key === 'email' || key === 'nickname') && checks[key].isChecking) return
    if (key === 'email' || key === 'nickname') {
      setChecks((current) => ({ ...current, [key]: initialCheck }))
    }
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function checkDuplicate(key: CheckKey) {
    if (!(key === 'email' ? emailValid : nicknameValid) || checks[key].isChecking || isSubmitting) return
    const label = key === 'email' ? '이메일' : '닉네임'
    setChecks((current) => ({ ...current, [key]: { isChecking: true, isAvailable: false } }))

    try {
      const response = key === 'email'
        ? await checkEmailDuplicate(form.email.trim())
        : await checkNicknameDuplicate(form.nickname.trim())
      if (typeof response.available !== 'boolean') throw new Error('Invalid duplicate response')
      setChecks((current) => ({ ...current, [key]: { ...current[key], isAvailable: response.available } }))
      window.alert(response.available ? `사용할 수 있는 ${label}이에요.` : `이미 사용 중인 ${label}이에요.`)
    } catch {
      window.alert('중복 확인에 실패했어요. 다시 시도해 주세요.')
    } finally {
      setChecks((current) => ({ ...current, [key]: { ...current[key], isChecking: false } }))
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit || isSubmitting) return
    setIsSubmitting(true)

    try {
      const response = await signup({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      })
      if (response.isSuccess !== true || typeof response.message !== 'string') throw new Error('Signup failed')
      window.alert(response.message)
    } catch {
      window.alert('회원가입에 실패했어요. 다시 시도해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="mx-auto flex w-[min(440px,calc(100%-32px))] flex-1 flex-col justify-center py-16">
      <h1 className="mb-8 text-[32px] font-bold tracking-[-0.04em] text-[#151820]">회원가입</h1>
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div>
          <label className={labelClass} htmlFor="signup-email">이메일</label>
          <div className="relative">
            <input id="signup-email" className={`${inputClass} pr-24`} type="email" autoComplete="email" placeholder="이메일" value={form.email} disabled={checks.email.isChecking || isSubmitting} aria-invalid={form.email.length > 0 && !emailValid} aria-describedby={form.email.length > 0 && !emailValid ? 'email-error' : undefined} onChange={(event) => changeField('email', event.target.value)} />
            <button className="absolute inset-y-0 right-4 cursor-pointer text-sm font-bold text-[#2878f0] disabled:cursor-default disabled:opacity-50" type="button" disabled={!emailValid || checks.email.isChecking || isSubmitting} onClick={() => void checkDuplicate('email')}>{checks.email.isChecking ? '확인 중' : '중복 확인'}</button>
          </div>
          {form.email.length > 0 && !emailValid && <p id="email-error" className={errorClass}>이메일 형식을 확인해 주세요.</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="signup-nickname">닉네임</label>
          <div className="relative">
            <input id="signup-nickname" className={`${inputClass} pr-24`} placeholder="2~12자" value={form.nickname} disabled={checks.nickname.isChecking || isSubmitting} aria-invalid={form.nickname.length > 0 && !nicknameValid} aria-describedby={form.nickname.length > 0 && !nicknameValid ? 'nickname-error' : undefined} onChange={(event) => changeField('nickname', event.target.value)} />
            <button className="absolute inset-y-0 right-4 cursor-pointer text-sm font-bold text-[#2878f0] disabled:cursor-default disabled:opacity-50" type="button" disabled={!nicknameValid || checks.nickname.isChecking || isSubmitting} onClick={() => void checkDuplicate('nickname')}>{checks.nickname.isChecking ? '확인 중' : '중복 확인'}</button>
          </div>
          {form.nickname.length > 0 && !nicknameValid && <p id="nickname-error" className={errorClass}>닉네임은 2~12자로 입력해 주세요.</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="signup-password">비밀번호</label>
          <input id="signup-password" className={inputClass} type="password" autoComplete="new-password" placeholder="8자 이상" value={form.password} disabled={isSubmitting} aria-invalid={form.password.length > 0 && !passwordValid} aria-describedby={form.password.length > 0 && !passwordValid ? 'password-help password-error' : 'password-help'} onChange={(event) => changeField('password', event.target.value)} />
          <p id="password-help" className="mt-2 text-xs text-[#9298a1]">영문 대소문자, 숫자, 특수문자(!@#$%^&amp;*)를 모두 포함해 8자 이상 입력해 주세요.</p>
          {form.password.length > 0 && !passwordValid && <p id="password-error" className={errorClass}>비밀번호 조건을 확인해 주세요.</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="signup-confirm">비밀번호 확인</label>
          <input id="signup-confirm" className={inputClass} type="password" autoComplete="new-password" placeholder="다시 입력" value={form.passwordConfirm} disabled={isSubmitting} aria-invalid={form.passwordConfirm.length > 0 && !confirmValid} aria-describedby={form.passwordConfirm.length > 0 && !confirmValid ? 'confirm-error' : undefined} onChange={(event) => changeField('passwordConfirm', event.target.value)} />
          {form.passwordConfirm.length > 0 && !confirmValid && <p id="confirm-error" className={errorClass}>비밀번호가 일치하지 않아요.</p>}
        </div>
        <button className="h-12 w-full cursor-pointer rounded-lg bg-[#2878f0] text-sm font-bold text-white disabled:cursor-default disabled:bg-[#a0baf3]" type="submit" disabled={!canSubmit || isSubmitting}>{isSubmitting ? '가입 중' : '가입하기'}</button>
      </form>
      <p className="mt-6 text-center text-sm text-[#9298a1]">이미 계정이 있나요? <Link className="font-bold text-[#2878f0] no-underline" to="/login">로그인</Link></p>
    </main>
  )
}
