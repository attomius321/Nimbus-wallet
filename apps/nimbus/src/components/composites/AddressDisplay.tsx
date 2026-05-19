import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from 'src/lib/utils'

interface AddressDisplayProps {
  address: string
  className?: string
}

function truncateAddress(address: string) {
  return `${address.slice(0, 7)}...${address.slice(-5)}`
}

export function AddressDisplay({ address, className }: AddressDisplayProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-1.5',
        'bg-neutral-800 text-sm text-neutral-300 transition-colors hover:bg-neutral-700',
        className
      )}
    >
      <span className="font-mono">{truncateAddress(address)}</span>
      {copied ? <Check className="size-3.5 text-green-400" /> : <Copy className="size-3.5" />}
    </button>
  )
}
