/**
 * Session state (mnemonic, address) is kept in chrome.storage.session — an in-memory
 * store that survives MV3 service worker termination (unlike plain module-scope vars)
 * and is cleared automatically when the browser closes.
 */

export function sendWalletState({ address }: { address: string | null }) {
  chrome.runtime.sendMessage({
    source: 'background',
    type: 'WALLET_STATE',
    initialized: true,
    unlocked: true,
    address,
  })
}

interface SessionStorage {
  sessionMnemonic: string | null
  sessionAddress: string | null
}

export async function getSessionMnemonic() {
  const { sessionMnemonic } = (await chrome.storage.session.get('sessionMnemonic')) as SessionStorage
  return sessionMnemonic ?? null
}

export async function getSessionAddress() {
  const { sessionAddress } = (await chrome.storage.session.get('sessionAddress')) as SessionStorage
  return sessionAddress ?? null
}

export async function setSessionAddress(value: string) {
  await chrome.storage.session.set({ sessionAddress: value })
}

export async function setSessionMnemonic(value: string) {
  await chrome.storage.session.set({ sessionMnemonic: value })
}

export async function setSession(mnemonic: string, address: string) {
  await chrome.storage.session.set({ sessionMnemonic: mnemonic, sessionAddress: address })
  sendWalletState({ address })
}

export async function lockVault() {
  await chrome.storage.session.remove(['sessionMnemonic', 'sessionAddress'])
  sendWalletState({ address: null })
}

export async function isUnlocked() {
  return (await getSessionMnemonic()) !== null
}
