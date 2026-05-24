import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '../../ui/dialog'
import { BackButton } from '../BackButton'
import { AddressDialogTrigger } from './AddressDialogTriggerContent'
import { AddressDialogContent } from './AddressDialogContent'

export function AddressDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <AddressDialogTrigger />
      </DialogTrigger>
      <DialogContent fullScreen>
        <DialogTitle>
          <div className="flex items-center gap-2 px-2 py-2">
            <DialogClose>
              <BackButton />
            </DialogClose>
            <span className="text-lg font-bold">Your Addresses</span>
          </div>
        </DialogTitle>
        <AddressDialogContent />
      </DialogContent>
    </Dialog>
  )
}
