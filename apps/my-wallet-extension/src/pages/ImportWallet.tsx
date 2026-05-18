import { BackButton } from '@/components/composites/BackButton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, type ChangeEvent } from 'react'
import WalletWorker from '@/workers/wallet.worker.ts?worker'
import { useStoreVault } from '@/hooks/useStoreVault'
import { useNavigate } from 'react-router-dom'
import { Logo } from '@/components/logo/Logo'

export function ImportWallet() {
  const navigate = useNavigate()
  const [state, setState] = useState<'error' | 'idle'>('idle')
  const [walletState, setWalletState] = useState<{ mnemonic: string[]; address: string }>({
    mnemonic: Array(12).fill(''),
    address: '',
  })
  const [password, setPassword] = useState('')
  const [working, setWorking] = useState(false)
  const { storeVault, saving } = useStoreVault(() => setState('error'))

  function onChangeMnemonic(value: string, index: number) {
    const words = [...walletState.mnemonic]
    words[index] = value
    setWalletState((prev) => ({ ...prev, mnemonic: words }))
  }

  function handleContinue() {
    if (!password || !walletState.mnemonic.every((w) => w)) return
    setWorking(true)

    const worker = new WalletWorker()

    worker.onmessage = async (e) => {
      const { ok, mnemonic, address } = e.data
      setWorking(false)
      worker.terminate()
      if (ok) {
        storeVault({ mnemonic, address, password })
      } else {
        setState('error')
      }
    }

    worker.postMessage({ mnemonic: walletState.mnemonic.join(' ') })
  }

  return (
    <div className="flex h-screen flex-col p-4">
      <BackButton onClick={() => navigate(-1)} />
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="mb-2 flex h-64 w-64 items-center justify-center rounded-2xl text-3xl">
            <Logo className="h-64 w-64" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Import Wallet</h1>
          <div className="flex flex-col items-center gap-4 text-sm leading-relaxed text-neutral-400">
            <p>Enter your 12-word mnemonic phrase and set a password to import your wallet.</p>
            <div className="grid w-full grid-cols-3 gap-2">
              {walletState.mnemonic.map((word, i) => (
                <Input
                  className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
                  value={word}
                  onChange={(e) => onChangeMnemonic(e.target.value, i)}
                />
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
            {state === 'error' && (
              <p className="text-red-400">
                Error importing the wallet. Please check your mnemonic and try again.
              </p>
            )}
            <Button
              className="w-full"
              disabled={!password || !walletState.mnemonic.every((w) => w) || working || saving}
              onClick={handleContinue}
            >
              {working || saving ? 'Importing...' : 'Continue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
