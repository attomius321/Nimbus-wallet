import { encryptMnemonic, decryptMnemonic } from '@repo/crypto'
import type { EncryptedVault } from '@repo/crypto'
import type {
  EthRequestMessage,
  EthResponseMessage,
  StoreVaultMessage,
  UnlockVaultMessage,
  VaultResponseMessage,
  WalletStateMessage,
} from '../shared/messages'

// ── In-memory session state ──────────────────────────────────────────────────

let sessionMnemonic: string | null = null
let sessionAddress: string | null = null

const  MESSAGE_ACTIONS = {
  STORE_VAULT: 'STORE_VAULT',
  UNLOCK_VAULT: 'UNLOCK_VAULT',
  LOCK_VAULT: 'LOCK_VAULT',
  GET_WALLET_STATE: 'GET_WALLET_STATE',
  ETH_REQUEST: 'ETH_REQUEST',
}

function lockVault() {
  sessionMnemonic = null
  sessionAddress = null
}

chrome.runtime.onInstalled.addListener(() => {
  if ('sidePanel' in chrome) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(console.error)
  }
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case MESSAGE_ACTIONS.STORE_VAULT: {
      const msg = message as StoreVaultMessage
      encryptMnemonic(msg.mnemonic, msg.password)
        .then(async (vault) => {
          await chrome.storage.local.set({ vault, address: msg.address, initialized: true })
          sessionMnemonic = msg.mnemonic
          sessionAddress = msg.address
          const res: VaultResponseMessage = { source: 'background', type: 'VAULT_RESPONSE', ok: true, address: msg.address }
          sendResponse(res)
        })
        .catch((err) => {
          const res: VaultResponseMessage = { source: 'background', type: 'VAULT_RESPONSE', ok: false, error: String(err) }
          sendResponse(res)
        })
      return true
    }
    case MESSAGE_ACTIONS.UNLOCK_VAULT: {
      const msg = message as UnlockVaultMessage
      chrome.storage.local.get(['vault', 'address']).then(async (stored) => {
        if (!stored.vault) {
          const res: VaultResponseMessage = { source: 'background', type: 'VAULT_RESPONSE', ok: false, error: 'No vault found' }
          return sendResponse(res)
        }
        try {
          const mnemonic = await decryptMnemonic(stored.vault as EncryptedVault, msg.password)
          sessionMnemonic = mnemonic
          sessionAddress = stored.address as string
          const res: VaultResponseMessage = { source: 'background', type: 'VAULT_RESPONSE', ok: true, address: sessionAddress }
          sendResponse(res)
        } catch {
          const res: VaultResponseMessage = { source: 'background', type: 'VAULT_RESPONSE', ok: false, error: 'Wrong password' }
          sendResponse(res)
        }
      })
      return true
    }
    case MESSAGE_ACTIONS.LOCK_VAULT: {
      lockVault();
      sendResponse({ ok: true })
      return false
    }
    case MESSAGE_ACTIONS.GET_WALLET_STATE: {
      chrome.storage.local.get(['initialized', 'address']).then((stored) => {
        const res: WalletStateMessage = {
          source: 'background', type: 'WALLET_STATE',
          initialized: !!stored.initialized,
          unlocked: sessionMnemonic !== null,
          address: sessionAddress ?? undefined,
        }
        sendResponse(res)
      })
      return true
    }
    case MESSAGE_ACTIONS.ETH_REQUEST: {
      const msg = message as EthRequestMessage
      const response: EthResponseMessage = {
        source: 'background', type: 'ETH_RESPONSE',
        id: msg.id,
        error: { code: 4200, message: 'Method not supported yet' },
      }
      if (sender.tab?.id !== undefined) {
        chrome.tabs.sendMessage(sender.tab.id, response)
      }
      sendResponse({ ok: true })
      return false
    }
    default:
      console.warn('Unknown message type:', message)
      sendResponse({ ok: false, error: 'Unknown message type' })
      return false
  }
})
