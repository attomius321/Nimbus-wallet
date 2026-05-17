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
    <div className="flex flex-col items-center justify-center h-screen bg-neutral-950 text-white gap-8 px-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="w-16 h-16 rounded-2xl bg-neutral-800 flex items-center justify-center text-3xl mb-2">
          ◈
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Unlock Wallet</h1>
        <p className="text-neutral-400 text-sm leading-relaxed">
          Enter your password to continue.
        </p>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
          className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
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