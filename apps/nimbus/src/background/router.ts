// background/router.ts
import type { ExtensionMessage, WalletStateMessage } from '../shared/messages'
import { handleStoreVault, handleUnlockVault } from './vault'
import { lockVault, isUnlocked, getSessionAddress } from './session'
import { getStorage } from '../shared/storage'
import { generateNewAccount, selectAccount } from './accounts'
import { convertToCurrency, getBalance } from './eth'

type SendResponse = (response: unknown) => void

const router: Partial<
  Record<
    ExtensionMessage['type'],
    (msg: any, sendResponse: SendResponse, sender: chrome.runtime.MessageSender) => boolean | void
  >
> = {
  STORE_VAULT: (msg, sendResponse) => {
    handleStoreVault(msg, sendResponse)
    return true
  },
  UNLOCK_VAULT: (msg, sendResponse) => {
    handleUnlockVault(msg, sendResponse)
    return true
  },
  LOCK_VAULT: (_, sendResponse) => {
    lockVault().then(() => sendResponse({ ok: true }))
    return true
  },
  GET_WALLET_STATE: (_, sendResponse) => {
    Promise.all([
      getStorage(['initialized', 'address']),
      isUnlocked(),
      getSessionAddress(),
    ]).then(([stored, unlocked, sessionAddress]) => {
      const res: WalletStateMessage = {
        source: 'background',
        type: 'WALLET_STATE',
        initialized: !!stored.initialized,
        unlocked,
        address: sessionAddress ?? undefined,
      }
      sendResponse(res)
    })
    return true
  },
  CREATE_ADDRESS: (_, sendResponse) => {
    generateNewAccount(sendResponse)
    return true
  },
  SELECT_ADDRESS: (msg, sendResponse) => {
    selectAccount(msg.address, sendResponse)
    return true
  },
  GET_BALANCE: (msg, sendResponse) => {
    getBalance(msg.address, sendResponse)
    return true
  },
  CONVERT_TO_CURRENCY: (msg, sendResponse) => {
    convertToCurrency(msg.id, msg.vs_currency, msg.value, sendResponse)
    return true
  },
}

chrome.runtime.onMessage.addListener((message: ExtensionMessage, _sender, sendResponse) => {
  const handler = router[message.type]
  if (!handler) {
    console.warn('Unknown message type:', message.type)
    sendResponse({ ok: false, error: 'Unknown message type' })
    return false
  }
  return handler(message, sendResponse, _sender) ?? false
})
