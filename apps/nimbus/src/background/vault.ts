import { encryptMnemonic, decryptMnemonic } from '@repo/crypto'
import type { EncryptedVault } from '@repo/crypto'
import type {
  StoreVaultMessage,
  UnlockVaultMessage,
  VaultResponseMessage,
} from '../shared/messages'
import { setSession } from './session'
import { getStorage, setStorage, type LocalStorage } from '@/shared/storage'

type SendResponse = (response: VaultResponseMessage) => void

export async function handleStoreVault(msg: StoreVaultMessage, sendResponse: SendResponse) {
  try {
    const vault = await encryptMnemonic(msg.mnemonic, msg.password)
    const toStore: LocalStorage = {
      vault,
      address: msg.address,
      accounts: [{ address: msg.address, index: 0 }],
      initialized: true,
    }
    await setStorage(toStore)
    await setSession(msg.mnemonic, msg.address)
    sendResponse({ source: 'background', type: 'VAULT_RESPONSE', ok: true, address: msg.address })
  } catch (err) {
    sendResponse({ source: 'background', type: 'VAULT_RESPONSE', ok: false, error: String(err) })
  }
}

export async function handleUnlockVault(msg: UnlockVaultMessage, sendResponse: SendResponse) {
  const stored: LocalStorage = (await getStorage(['vault', 'address'])) as LocalStorage
  if (!stored.vault) {
    sendResponse({
      source: 'background',
      type: 'VAULT_RESPONSE',
      ok: false,
      error: 'No vault found',
    })
    return
  }
  try {
    const mnemonic = await decryptMnemonic(stored.vault as EncryptedVault, msg.password)
    await setSession(mnemonic, stored.address as string)
    sendResponse({
      source: 'background',
      type: 'VAULT_RESPONSE',
      ok: true,
      address: stored.address,
    })
  } catch {
    sendResponse({
      source: 'background',
      type: 'VAULT_RESPONSE',
      ok: false,
      error: 'Wrong password',
    })
  }
}
