import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { LogOut, Menu } from 'lucide-react'
import { BackButton } from '../BackButton'
import { useWalletStore } from '@/store/walletStore'

export function MenuDialog() {
  const { setWalletState } = useWalletStore.getState()

  function handleLogOut() {
    chrome.runtime.sendMessage({ source: 'ui', type: 'LOCK_VAULT' })
    setWalletState({ initialized: true, unlocked: false })
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="ghost" size="icon">
          <Menu className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent side>
        <DialogTitle>
          <div className="flex items-center gap-2 px-2 py-2">
            <DialogClose>
              <BackButton />
            </DialogClose>
          </div>
        </DialogTitle>
        <nav className="flex flex-col p-2">
          <DialogClose onClick={handleLogOut}>
            <Button variant="secondary" className="w-full justify-start gap-3 px-3">
              <LogOut className="size-4" />
              <span>Log out</span>
            </Button>
          </DialogClose>
        </nav>
      </DialogContent>
    </Dialog>
  )
}
