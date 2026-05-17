import { createHashRouter } from 'react-router-dom'
import { WelcomeLayout } from '../layouts/WelcomeLayout'
import { WalletLayout } from '../layouts/WalletLayout'

export const routerFor = () => createHashRouter([
  {
    element: <WelcomeLayout />,
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
