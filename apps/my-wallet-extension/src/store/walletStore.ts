import { create } from 'zustand'

interface WalletStore {
  address: string | null
  unlocked: boolean
  initialized: boolean
  setWalletState: (state: { address?: string; unlocked: boolean; initialized: boolean }) => void
  lock: () => void
}

export const useWalletStore = create<WalletStore>((set) => ({
  address: null,
  unlocked: false,
  initialized: false,
  setWalletState: ({ address, unlocked, initialized }) =>
    set({ address: address ?? null, unlocked, initialized }),
  lock: () => set({ address: null, unlocked: false }),
}))
