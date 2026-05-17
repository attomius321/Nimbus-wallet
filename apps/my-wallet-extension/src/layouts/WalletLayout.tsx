import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function WalletLayout() {
  return (
    <div className="h-screen bg-neutral-950 text-white flex flex-col">
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
    <header className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
      <span className="font-bold text-lg tracking-tight">Nimbus</span>
      <span className="text-xs bg-neutral-800 text-neutral-300 px-2 py-1 rounded-full">
        Ethereum
      </span>
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
          className={`flex-1 rounded-none py-3 text-xs font-medium h-auto transition-colors ${
            location.pathname === item.path
              ? 'text-white border-t border-white'
              : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          {item.label}
        </Button>
      ))}
    </nav>
  )
}
