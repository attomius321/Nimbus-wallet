import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'

export function AddressDialog() {
  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogTitle>Confirm</DialogTitle>
        <DialogDescription>Are you sure?</DialogDescription>
        <DialogClose>Cancel</DialogClose>
      </DialogContent>
    </Dialog>
  )
}
