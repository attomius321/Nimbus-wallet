import { StrictMode, useState, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import '../index.css'
import { Spinner } from '../components/ui/spinner'
import { createRouter } from '../routes/routes'
import type { WalletStateMessage } from '../shared/messages'
import { useWalletStore } from '@/store/walletStore'

if (!('sidePanel' in chrome)) {
  document.body.classList.add('popup')
}

const router = createRouter()

function App() {
  const [ready, setReady] = useState(false)
  const navigated = useRef(false)
  const { setWalletState } = useWalletStore.getState()

  useEffect(() => {
    const unsubscribe = useWalletStore.subscribe((state, prevState) => {
      if (!state.unlocked && prevState.unlocked) {
        router.navigate('/unlock', { replace: true })
      }
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    const listener = (message: WalletStateMessage) => {
      console.log('hereee')
      if (message.type === 'WALLET_STATE') {
        setWalletState(message)
      }
    }
    chrome.runtime.onMessage.addListener(listener)
    return () => chrome.runtime.onMessage.removeListener(listener)
  }, [])

  useEffect(() => {
    chrome.runtime
      .sendMessage({ source: 'ui', type: 'GET_WALLET_STATE' })
      .then((res: WalletStateMessage) => {
        let path = '/'
        if (res.initialized && res.unlocked) {
          path = '/dashboard'
          setWalletState({
            address: res.address,
            initialized: res.initialized,
            unlocked: res.unlocked,
          })
        } else if (res.initialized) {
          path = '/unlock'
          setWalletState({
            initialized: res.initialized,
            unlocked: false,
          })
        }
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
      <div className="flex h-screen items-center justify-center bg-neutral-950">
        <Spinner className="size-10 text-blue-500" />
      </div>
    )
  }

  return <RouterProvider router={router} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
