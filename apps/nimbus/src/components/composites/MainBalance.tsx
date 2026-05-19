export function MainBalance({
  symbol,
  balance,
  usdValue,
}: {
  symbol: string
  balance: string
  usdValue: string
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-sm text-neutral-400">Total Balance</span>
      <span className="text-4xl font-bold">{usdValue}</span>
      <span className="text-sm text-neutral-500">
        {balance} {symbol}
      </span>
    </div>
  )
}
