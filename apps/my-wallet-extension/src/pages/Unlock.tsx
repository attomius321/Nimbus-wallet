import { useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { VaultResponseMessage } from '@/shared/messages'
import { useWalletStore } from '@/store/walletStore'
import { Logo } from '@/components/logo/Logo'

export function Unlock() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setWalletState } = useWalletStore.getState()

  async function handleUnlock() {
    if (!password) return
    setLoading(true)
    setError('')
    try {
      const res: VaultResponseMessage = await chrome.runtime.sendMessage({
        source: 'ui',
        type: 'UNLOCK_VAULT',
        password,
      })
      if (res.ok) {
        setWalletState({ address: res.address, unlocked: true, initialized: true })
        navigate('/dashboard')
      } else {
        setError('Wrong password. Try again.')
      }
    } catch {
      setError('Failed to unlock. Try again.')
    } finally {
      setLoading(false)
    }
  }

  async function clearVault() {
    await chrome.storage.local.clear()
    navigate('/')
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-8 bg-neutral-950 px-6 text-white">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="mb-2 flex h-64 w-64 items-center justify-center rounded-2xl text-3xl">
          <Logo className="h-64 w-64" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Unlock Wallet</h1>
        <p className="text-sm leading-relaxed text-neutral-400">Enter your password to continue.</p>
      </div>
      <div className="flex w-full flex-col gap-3">
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
          className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button className="w-full" disabled={!password || loading} onClick={handleUnlock}>
          {loading ? 'Unlocking…' : 'Unlock'}
        </Button>
        <Button className="w-full" variant="secondary" onClick={clearVault}>
          Reset Wallet
        </Button>
      </div>
    </div>
  )
}
