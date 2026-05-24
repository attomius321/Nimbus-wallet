import { Item, ItemActions, ItemContent, ItemGroup, ItemHeader } from '@/components/ui/item'
import { Button } from '@/components/ui/button'
import { useStorage } from '@/hooks/useStorage'
import { useEffect, useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { useWalletStore } from '@/store/walletStore'

export function AddressDialogContent() {
  const { data, refetch } = useStorage(['accounts', 'address'])
  const [selected, setSelected] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const { setWalletState } = useWalletStore.getState()

  useEffect(() => {
    if (data?.address) {
      setSelected(data.address)
    }
  }, [data?.address])

  function copyAddress(address: string) {
    navigator.clipboard.writeText(address)
    setCopied(address)
    setTimeout(() => setCopied(null), 2000)
  }

  function createNewAccount() {
    chrome.runtime.sendMessage({ source: 'ui', type: 'CREATE_ADDRESS' }).then((res) => {
      if (res.ok) {
        setWalletState({ address: res.address, initialized: true, unlocked: true })
        refetch()
      } else {
        alert('Failed to create new account')
      }
    })
  }

  function selectAccount(address: string) {
    chrome.runtime.sendMessage({ source: 'ui', type: 'SELECT_ADDRESS', address }).then((res) => {
      if (res.ok) {
        setSelected(address)
        setWalletState({ address, initialized: true, unlocked: true })
      }
    })
  }

  return (
    <>
      {data?.accounts?.length === 0 && (
        <div className="flex h-full flex-col gap-4 text-white">
          <p>No addresses found</p>
        </div>
      )}
      <div className="mx-2.5 flex min-h-0 flex-1 flex-col gap-4 text-white">
        <ItemGroup className="min-h-0 flex-1 overflow-y-auto">
          {data?.accounts?.map((account, index) => (
            <Item
              key={account.address}
              variant={selected === account.address ? 'selected' : 'outline'}
              role="listitem"
              onClick={() => selectAccount(account.address)}
              style={{ cursor: 'pointer' }}
            >
              <ItemHeader className="text-sm text-neutral-400">Account {index + 1}</ItemHeader>
              <ItemContent>{account.address}</ItemContent>
              <ItemActions>
                <button
                  onClick={() => copyAddress(account.address)}
                  className="text-neutral-400 transition-colors hover:text-white"
                >
                  {copied === account.address ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
        <Button className="mb-4" onClick={createNewAccount}>
          Create new account
        </Button>
      </div>
    </>
  )
}
