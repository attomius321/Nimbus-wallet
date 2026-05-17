import { Outlet } from "react-router-dom";

export function WelcomeLayout() {
  return (
    <div className="h-screen bg-neutral-950 text-white flex flex-col">
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
