import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { VaultResponseMessage } from '@/shared/messages'

interface StoreVaultParams {
  mnemonic: string
  address: string
  password: string
}

export function useStoreVault(onError: () => void) {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)

  async function storeVault({ mnemonic, address, password }: StoreVaultParams) {
    setSaving(true)
    try {
      const res: VaultResponseMessage = await chrome.runtime.sendMessage({
        source: 'ui',
        type: 'STORE_VAULT',
        mnemonic,
        password,
        address,
      })
      if (res.ok) {
        navigate('/dashboard')
      } else {
        onError()
      }
    } catch {
      onError()
    } finally {
      setSaving(false)
    }
  }

  return { storeVault, saving }
}
