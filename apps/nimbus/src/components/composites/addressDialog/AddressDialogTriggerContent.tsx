import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

export function AddressDialogTrigger() {
  return (
    <Button variant="outline" size="sm" className="px-3 text-sm">
      Change account <ChevronDown className="size-4" />
    </Button>
  )
}
