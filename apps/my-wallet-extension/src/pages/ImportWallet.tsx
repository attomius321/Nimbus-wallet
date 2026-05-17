import { BackButton } from '@/components/BackButton'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, type ChangeEvent } from 'react';
import WalletWorker from '@/workers/wallet.worker.ts?worker'
import { useStoreVault } from '@/hooks/useStoreVault'

export function ImportWallet() {
  const [state, setState] = useState<'error' | 'idle'>('idle')
  const [walletState, setWalletState] = useState<{ mnemonic: string[]; address: string }>({
    mnemonic: Array(12).fill(''),
    address: '',
  })
  const [password, setPassword] = useState('')
  const [working, setWorking] = useState(false)
  const { storeVault, saving } = useStoreVault(() => setState('error'))

  function onChangeMnemonic(value: string, index: number) {
    const words = [...walletState.mnemonic];
    words[index] = value;
    setWalletState((prev) => ({ ...prev, mnemonic: words }));
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
    <div className="flex flex-col h-screen p-4">
      <BackButton />
      <div className="flex flex-col items-center justify-center flex-1 gap-8 px-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-16 h-16 rounded-2xl bg-neutral-800 flex items-center justify-center text-3xl mb-2">
            ◈
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Import Wallet</h1>
          <div className="text-neutral-400 text-sm leading-relaxed flex flex-col items-center gap-4">
            <p>Enter your 12-word mnemonic phrase and set a password to import your wallet.</p>
            <div className="grid grid-cols-3 gap-2 w-full">
              {
                walletState.mnemonic.map((word, i) => (
                  <Input
                    className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                    value={word}
                    onChange={(e) => onChangeMnemonic(e.target.value, i)}
                  />
                ))
              }
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
            {state === 'error' && <p className="text-red-400">Error importing the wallet. Please check your mnemonic and try again.</p>}
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
