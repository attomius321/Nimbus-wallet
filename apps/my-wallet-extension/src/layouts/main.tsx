import { StrictMode, useState, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import '../index.css'
import { Spinner } from '../components/ui/spinner'
import { routerFor } from '../routes/routes'
import type { WalletStateMessage } from '../shared/messages'

if (!('sidePanel' in chrome)) {
  document.body.classList.add('popup')
}

const router = routerFor()

function App() {
  const [ready, setReady] = useState(false)
  const navigated = useRef(false)

  useEffect(() => {
    chrome.runtime.sendMessage({ source: 'ui', type: 'GET_WALLET_STATE' })
      .then((res: WalletStateMessage) => {
        let path = '/'
        if (res.initialized && res.unlocked) path = '/dashboard'
        else if (res.initialized) path = '/unlock'
        if (!navigated.current) {
          navigated.current = true
          router.navigate(path, { replace: true })
        }
        setReady(true)
      })
      .catch(() => setReady(true))
  }, [])

  if (!ready) {
    return (
      <div className="h-screen bg-neutral-950 flex items-center justify-center">
        <Spinner className="text-blue-500 size-10" />
      </div>
    )
  }

  return <RouterProvider router={router} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
