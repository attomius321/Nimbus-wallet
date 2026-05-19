import { Spinner } from '@/components/ui/spinner'
import { BackButton } from '@/components/composites/BackButton'
import { useEffect, useState, type ChangeEvent } from 'react'
import WalletWorker from '@/workers/wallet.worker.ts?worker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useStoreVault } from '@/hooks/useStoreVault'
import { useNavigate } from 'react-router-dom'

export function CreateWallet() {
  const navigate = useNavigate()
  const [state, setState] = useState<'loading' | 'error' | 'success'>('loading')
  const [walletState, setWalletState] = useState<{ mnemonic: string; address: string } | null>(null)
  const [password, setPassword] = useState('')
  const { storeVault, saving } = useStoreVault(() => setState('error'))

  useEffect(() => {
    const worker = new WalletWorker()

    worker.onmessage = (e) => {
      let { ok, mnemonic, address } = e.data
      if (ok) {
        setState('success')
        setWalletState({ mnemonic, address })
      } else {
        setState('error')
      }
      worker.terminate()
    }

    worker.postMessage({ mnemonic: null })
    return () => worker.terminate()
  }, [])

  function handleContinue() {
    if (!walletState || !password) return
    storeVault({ mnemonic: walletState.mnemonic, address: walletState.address, password })
  }

  return (
    <div className="flex h-screen flex-col p-4">
      <BackButton onClick={() => navigate(-1)} />
      <div className="flex flex-1 items-center justify-center">
        {state === 'loading' && <Spinner className="size-10 text-blue-500" />}
        {state !== 'loading' && walletState && (
          <div className="flex w-full flex-col items-center gap-4">
            <p className="text-lg font-bold">Wallet created successfully!</p>
            <p className="text-center text-sm text-neutral-400">
              Save the mnemonic phrase in a secure location.
            </p>
            <div className="grid w-full grid-cols-3 gap-2">
              {walletState.mnemonic.split(' ').map((word, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg bg-neutral-800 px-3 py-2 text-sm"
                >
                  <span className="w-4 text-xs text-neutral-500">{i + 1}</span>
                  <span className="font-mono">{word}</span>
                </div>
              ))}
            </div>
            <div className="flex w-full flex-col gap-2 pt-2">
              <label className="text-sm text-neutral-400">
                Set a password to encrypt your wallet
              </label>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
                className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
              />
            </div>
            {state === 'error' && <p className="text-red-400">Error creating wallet. Try again.</p>}
            <Button className="w-full" disabled={!password || saving} onClick={handleContinue}>
              {saving ? 'Saving…' : 'Continue'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
