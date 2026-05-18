import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function Welcome() {
  const navigate = useNavigate()

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-8 bg-neutral-950 px-6 text-white">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-800 text-3xl">
          ◈
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Nimbus</h1>
        <p className="text-sm leading-relaxed text-neutral-400">
          A non-custodial Ethereum wallet that lives in your browser.
        </p>
      </div>

      <div className="flex w-full flex-col gap-3">
        <Button className="w-full" onClick={() => navigate('/create-wallet')}>
          Create HD Wallet
        </Button>
        <Button className="w-full" variant="secondary" onClick={() => navigate('/import-wallet')}>
          Import Existing Wallet
        </Button>
      </div>
    </div>
  )
}
