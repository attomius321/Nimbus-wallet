import { createHashRouter } from 'react-router-dom'
import { WelcomeLayout } from '../layouts/WelcomeLayout'
import { WalletLayout } from '../layouts/WalletLayout'
import { Spinner } from '@/components/ui/spinner'

function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-neutral-950">
      <Spinner className="size-8 text-blue-500" />
    </div>
  )
}

export const createRouter = () =>
  createHashRouter([
    {
      element: <WelcomeLayout />,
      HydrateFallback: Loading,
      children: [
        {
          path: '/',
          lazy: () => import('../pages/Welcome').then((m) => ({ Component: m.Welcome })),
        },
        {
          path: '/create-wallet',
          lazy: () => import('../pages/CreateWallet').then((m) => ({ Component: m.CreateWallet })),
        },
        {
          path: '/import-wallet',
          lazy: () => import('../pages/ImportWallet').then((m) => ({ Component: m.ImportWallet })),
        },
        {
          path: '/unlock',
          lazy: () => import('../pages/Unlock').then((m) => ({ Component: m.Unlock })),
        },
      ],
    },
    {
      element: <WalletLayout />,
      HydrateFallback: Loading,
      children: [
        {
          path: '/dashboard',
          lazy: () => import('../pages/Dashboard').then((m) => ({ Component: m.Dashboard })),
        },
        {
          path: '/send',
          lazy: () => import('../pages/Send').then((m) => ({ Component: m.Send })),
        },
        {
          path: '/receive',
          lazy: () => import('../pages/Receive').then((m) => ({ Component: m.Receive })),
        },
        {
          path: '/settings',
          lazy: () => import('../pages/Settings').then((m) => ({ Component: m.Settings })),
        },
      ],
    },
  ])
