import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AddressDialog } from '@/components/composites/AddressDialog'

export function WalletLayout() {
  return (
    <div className="flex h-screen flex-col bg-neutral-950 text-white">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}

function Header() {
  return (
    <header className="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
      <AddressDialog />
    </header>
  )
}

function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const items = [
    { label: 'Wallet', path: '/dashboard' },
    { label: 'Send', path: '/send' },
    { label: 'Receive', path: '/receive' },
    { label: 'Settings', path: '/settings' },
  ]

  return (
    <nav className="flex border-t border-neutral-800">
      {items.map((item) => (
        <Button
          key={item.path}
          variant="ghost"
          onClick={() => navigate(item.path)}
          className={`h-auto flex-1 rounded-none py-3 text-xs font-medium transition-colors ${
            location.pathname === item.path
              ? 'border-t border-white text-white'
              : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          {item.label}
        </Button>
      ))}
    </nav>
  )
}
