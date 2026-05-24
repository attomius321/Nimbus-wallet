import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { cn } from 'src/lib/utils'

function Dialog(props: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root {...props} />
}

function DialogTrigger(props: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal(props: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal {...props} />
}

function DialogBackdrop({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-backdrop"
      className={cn(
        'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm',
        'transition-all duration-200',
        'data-[ending-style]:opacity-0 data-[starting-style]:opacity-0',
        className
      )}
      {...props}
    />
  )
}

interface DialogContentProps extends DialogPrimitive.Popup.Props {
  fullScreen?: boolean
  side?: boolean
}

function DialogContent({ className, children, fullScreen, side, ...props }: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogBackdrop />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          'fixed z-50 bg-neutral-900 shadow-xl transition-all duration-300',
          side && 'inset-y-0 right-0 w-full',
          fullScreen && 'inset-0 rounded-none flex flex-col',
          !side &&
            !fullScreen &&
            'top-1/2 left-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-neutral-800 p-6',
          side && 'data-[ending-style]:translate-x-full data-[starting-style]:translate-x-full',
          fullScreen && 'data-[ending-style]:translate-y-4 data-[starting-style]:translate-y-4',
          !side && !fullScreen && 'data-[ending-style]:scale-95 data-[starting-style]:scale-95',
          'data-[ending-style]:opacity-0 data-[starting-style]:opacity-0',
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('mb-1 text-base font-semibold text-white', className)}
      {...props}
    />
  )
}

function DialogDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('text-sm text-neutral-400', className)}
      {...props}
    />
  )
}

function DialogClose({ className, ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" className={cn(className)} {...props} />
}

export { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose }
