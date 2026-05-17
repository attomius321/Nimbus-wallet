import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function Welcome() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-neutral-950 text-white gap-8 px-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="w-16 h-16 rounded-2xl bg-neutral-800 flex items-center justify-center text-3xl mb-2">
          ◈
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Nimbus</h1>
        <p className="text-neutral-400 text-sm leading-relaxed">
          A non-custodial Ethereum wallet that lives in your browser.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full">
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
