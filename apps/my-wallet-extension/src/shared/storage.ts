import type { EncryptedVault } from '@repo/crypto'

export interface LocalStorage {
  vault?: EncryptedVault
  address?: string
  initialized?: boolean
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
