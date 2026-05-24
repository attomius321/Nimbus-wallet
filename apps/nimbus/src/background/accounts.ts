import { getSessionMnemonic, setSessionAddress } from './session'
import { getStorage, setStorage } from '@/shared/storage'

async function addAddressToStorage(address: string) {
  await getStorage(['accounts']).then((stored) => {
    const accounts = stored.accounts || []
    if (!accounts.some((account) => account.address === address)) {
      accounts.push({ address, index: accounts.length })
      setStorage({ accounts })
    }
  })
}

export async function generateNewAccount(sendResponse: (response: unknown) => void) {
  const mnemonic = getSessionMnemonic()
  if (!mnemonic) {
    sendResponse({
      source: 'background',
      type: 'CREATE_ADDRESS',
      ok: false,
      error: 'No mnemonic found',
    })
    return
  }
  try {
    const account = { address: 'asd' }
    setSessionAddress(account.address)
    await addAddressToStorage(account.address)
    sendResponse({
      source: 'background',
      type: 'CREATE_ADDRESS',
      ok: true,
      address: account.address,
    })
  } catch {
    sendResponse({
      source: 'background',
      type: 'CREATE_ADDRESS',
      ok: false,
      error: 'Failed to generate address',
    })
  }
}
