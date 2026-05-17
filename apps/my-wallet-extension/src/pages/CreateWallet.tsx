import { Spinner } from '@/components/ui/spinner'
import { BackButton } from '@/components/BackButton'
import { useEffect, useState, type ChangeEvent } from 'react'
import WalletWorker from '@/workers/wallet.worker.ts?worker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useStoreVault } from '@/hooks/useStoreVault'

export function CreateWallet() {
  const [state, setState] = useState<'loading' | 'error' | 'success'>('loading')
  const [walletState, setWalletState] = useState<{ mnemonic: string; address: string } | null>(null)
  const [password, setPassword] = useState('')
  const { storeVault, saving } = useStoreVault(() => setState('error'))

  useEffect(() => {
    const worker = new WalletWorker()

    worker.onmessage = (e) => {
      const { ok, mnemonic, address } = e.data
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
    <div className="flex flex-col h-screen p-4">
      <BackButton />
      <div className="flex items-center justify-center flex-1">
        {state === 'loading' && <Spinner className="text-blue-500 size-10" />}
        {state !== 'loading' && walletState && (
          <div className="flex flex-col items-center gap-4 w-full">
            <p className="text-lg font-bold">Wallet created successfully!</p>
            <p className="text-neutral-400 text-sm text-center">Save the mnemonic phrase in a secure location.</p>
            <div className="grid grid-cols-3 gap-2 w-full">
              {walletState.mnemonic.split(' ').map((word, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-neutral-800 rounded-lg px-3 py-2 text-sm"
                >
                  <span className="text-neutral-500 text-xs w-4">{i + 1}</span>
                  <span className="font-mono">{word}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2 w-full pt-2">
              <label className="text-sm text-neutral-400">Set a password to encrypt your wallet</label>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
              />
            </div>
            {state === 'error' && <p className="text-red-400">Error creating wallet. Try again.</p>}
            <Button
              className="w-full"
              disabled={!password || saving}
              onClick={handleContinue}
            >
              {saving ? 'Saving…' : 'Continue'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}


