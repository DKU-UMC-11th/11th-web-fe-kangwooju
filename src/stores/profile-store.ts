import { create } from 'zustand'

interface ProfileStore {
  email: string
  nickname: string
  setProfile: (profile: { email: string; nickname: string }) => void
}

export const useProfileStore = create<ProfileStore>((set) => ({
  email: '',
  nickname: '',
  setProfile: (profile) => set(profile),
}))
