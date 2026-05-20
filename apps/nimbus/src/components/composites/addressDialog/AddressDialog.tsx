import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog'
import { BackButton } from '../BackButton'
import { AddressDialogTrigger } from './AddressDialogTriggerContent'

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
          </div>
        </DialogTitle>
        <DialogDescription>Are you sure?</DialogDescription>
        <DialogClose>Cancel</DialogClose>
      </DialogContent>
    </Dialog>
  )
}
