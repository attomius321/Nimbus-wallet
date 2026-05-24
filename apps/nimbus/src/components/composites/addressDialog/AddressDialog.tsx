import { useStorage } from '@/hooks/useStorage'
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '../../ui/dialog'
import { BackButton } from '../BackButton'
import { AddressDialogTrigger } from './AddressDialogTriggerContent'

export function AddressDialog() {
  const { data } = useStorage(['accounts'])

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
        {data?.accounts?.length === 0 && (
          <div className="flex h-full flex-col justify-center gap-4 text-white">
            <p>No addresses found</p>
          </div>
        )}
        <div className="flex h-full flex-col items-center justify-center gap-4 text-white">
          {data?.accounts?.map((account) => (
            <div key={account.address}>{account.address}</div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
