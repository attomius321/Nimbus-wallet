import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-6 p-4 pt-6">
      <div className="flex flex-col items-center gap-1">
        <span className="text-neutral-400 text-sm">Total Balance</span>
        <span className="text-4xl font-bold">$0.00</span>
        <span className="text-neutral-500 text-sm">0 ETH</span>
      </div>

      <div className="flex gap-3 justify-center">
        <Button variant="secondary" onClick={() => navigate('/send')}>Send</Button>
        <Button variant="secondary" onClick={() => navigate('/receive')}>Receive</Button>
        <Button variant="secondary" onClick={() => {}}>Swap</Button>
      </div>

      <section>
        <h2 className="text-neutral-400 text-xs uppercase tracking-widest mb-3">Tokens</h2>
        <div className="flex flex-col gap-2">
          <TokenRow symbol="ETH" name="Ethereum" balance="0" usdValue="$0.00" />
        </div>
      </section>
    </div>
  )
}

function TokenRow({
  symbol,
  name,
  balance,
  usdValue,
}: {
  symbol: string
  name: string
  balance: string
  usdValue: string
}) {
  return (
    <div className="flex items-center justify-between bg-neutral-900 rounded-xl px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-xs font-bold">
          {symbol[0]}
        </div>
        <div>
          <div className="text-sm font-medium">{symbol}</div>
          <div className="text-neutral-500 text-xs">{name}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm">{balance}</div>
        <div className="text-neutral-500 text-xs">{usdValue}</div>
      </div>
    </div>
  )
}
