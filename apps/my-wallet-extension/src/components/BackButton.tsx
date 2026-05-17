import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function BackButton() {
  const navigate = useNavigate()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="self-start text-neutral-400 hover:text-white hover:bg-transparent"
      onClick={() => navigate(-1)}
    >
      <ArrowLeft className="size-6" />
    </Button>
  )
}
