import { useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { VaultResponseMessage } from '@/shared/messages'

export function Unlock() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
        <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-800 text-3xl">
          ◈
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
