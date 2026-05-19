import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function BackButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('self-start text-neutral-400 hover:bg-transparent hover:text-white', className)}
      {...props}
    >
      <ArrowLeft className="size-6" />
    </Button>
  )
}
