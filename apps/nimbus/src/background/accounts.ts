import { generateAccount } from '@repo/crypto'
import { getSessionMnemonic, setSession, setSessionAddress } from './session'
import { getStorage, setStorage } from '@/shared/storage'

export async function selectAccount(address: string, sendResponse: (response: unknown) => void) {
  setSessionAddress(address)
  await setStorage({ address })
  sendResponse({ source: 'background', type: 'SELECT_ADDRESS', ok: true, address })
}

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
  const index = await getStorage(['accounts']).then((stored) => stored.accounts?.length || 0)
  const mnemonic = getSessionMnemonic()
  console.log(mnemonic)
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
    const account = generateAccount(mnemonic, index)
    setSessionAddress(account.address)
    await addAddressToStorage(account.address)
    await setStorage({ address: account.address })
    setSession(mnemonic, account.address)
    sendResponse({
      source: 'background',
      type: 'CREATE_ADDRESS',
      ok: true,
      address: account.address,
      accountIndex: account.accountIndex,
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
