import { cn } from '@/lib/utils'
import logoUrl from '@assets/nimbus.png'

export function Logo({ className }: { className?: string }) {
  return <img src={logoUrl} alt="Logo" className={cn('block object-contain', className)} />
}
