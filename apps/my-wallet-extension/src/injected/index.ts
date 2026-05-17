import type { AccountsChangedMessage, ChainChangedMessage, EthRequestMessage, EthResponseMessage } from '../shared/messages'

// EIP-1193 compliant provider injected into page context
let requestId = 0
const pending = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>()

const provider = {
  isNimbusWallet: true,
  isMetaMask: false, // set true only if explicitly mimicking MM

  request({ method, params = [] }: { method: string; params?: unknown[] }): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const id = ++requestId
      pending.set(id, { resolve, reject })

      const message: EthRequestMessage = {
        source: 'injected',
        type: 'ETH_REQUEST',
        id,
        method,
        params,
      }
      window.postMessage(message, '*')
    })
  },

  on(event: string, handler: (...args: unknown[]) => void) {
    window.addEventListener('message', (e) => {
      if (e.source !== window) return
      const msg = e.data as AccountsChangedMessage | ChainChangedMessage
      if (msg?.source !== 'background') return
      if (event === 'accountsChanged' && msg.type === 'ACCOUNTS_CHANGED') {
        handler((msg as AccountsChangedMessage).accounts)
      }
      if (event === 'chainChanged' && msg.type === 'CHAIN_CHANGED') {
        handler((msg as ChainChangedMessage).chainId)
      }
    })
    return provider
  },

  removeListener(_event: string, _handler: unknown) {
    return provider
  },
}

// Handle responses from content-script relay
window.addEventListener('message', (event) => {
  if (event.source !== window) return
  const msg = event.data as EthResponseMessage
  if (msg?.source !== 'background' || msg?.type !== 'ETH_RESPONSE') return

  const p = pending.get(msg.id)
  if (!p) return
  pending.delete(msg.id)

  if (msg.error) {
    const err = Object.assign(new Error(msg.error.message), { code: msg.error.code })
    p.reject(err)
  } else {
    p.resolve(msg.result)
  }
})

// Announce provider via EIP-6963 and legacy window.ethereum
Object.defineProperty(window, 'ethereum', {
  value: provider,
  writable: false,
  configurable: false,
})

window.dispatchEvent(
  new CustomEvent('eip6963:announceProvider', {
    detail: Object.freeze({
      info: {
        uuid: 'nimbus-wallet-v1',
        name: 'Nimbus',
        icon: '',
        rdns: 'com.nimbuswallet',
      },
      provider,
    }),
  }),
)
