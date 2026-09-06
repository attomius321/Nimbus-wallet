import type { EncryptedVault } from '@repo/crypto'
import type { NetworkId } from './networks'

export type AccountType = {
  address: string
  index: number
}

export type AccountsType = AccountType[]

export interface LocalStorage {
  vault?: EncryptedVault
  address?: string
  accounts?: AccountsType
  initialized?: boolean
  isSignedIn?: boolean
  network?: NetworkId
  /** User-supplied RPC endpoint. Overrides the active network's public default. */
  rpcUrl?: string
}

export async function getStorage<K extends keyof LocalStorage>(
  keys: K[]
): Promise<Pick<LocalStorage, K>> {
  return chrome.storage.local.get(keys) as Promise<Pick<LocalStorage, K>>
}

export async function setStorage(items: LocalStorage): Promise<void> {
  return chrome.storage.local.set(items)
}

export async function clearStorage(): Promise<void> {
  return chrome.storage.local.clear()
}
