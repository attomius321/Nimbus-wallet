import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { MainBalance } from '@/components/composites/MainBalance'

export function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-6 p-4 pt-6">
      <MainBalance symbol="ETH" balance="0" usdValue="$0.00" />
      <div className="flex justify-center gap-3">
        <Button variant="secondary" onClick={() => navigate('/send')}>
          Send
        </Button>
        <Button variant="secondary" onClick={() => navigate('/receive')}>
          Receive
        </Button>
        <Button variant="secondary" onClick={() => {}}>
          Swap
        </Button>
      </div>

      <section>
        <h2 className="mb-3 text-xs tracking-widest text-neutral-400 uppercase">Tokens</h2>
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
    <div className="flex items-center justify-between rounded-xl bg-neutral-900 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-700 text-xs font-bold">
          {symbol[0]}
        </div>
        <div>
          <div className="text-sm font-medium">{symbol}</div>
          <div className="text-xs text-neutral-500">{name}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm">{balance}</div>
        <div className="text-xs text-neutral-500">{usdValue}</div>
      </div>
    </div>
  )
}
