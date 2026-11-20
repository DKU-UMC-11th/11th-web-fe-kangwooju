const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/

export function isValidEmail(value: string) {
  return EMAIL_REGEX.test(value.trim())
}

export function isValidNickname(value: string) {
  return value.trim().length >= 2 && value.trim().length <= 12
}

export function isValidPassword(value: string) {
  return PASSWORD_REGEX.test(value)
}
