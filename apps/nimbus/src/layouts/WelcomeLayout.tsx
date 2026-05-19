import { Outlet } from 'react-router-dom'

export function WelcomeLayout() {
  return (
    <div className="flex h-screen flex-col bg-neutral-950 text-white">
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
