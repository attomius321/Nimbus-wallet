export type MessageSource = 'ui' | 'background' | 'content-script' | 'injected'

export interface EthRequestMessage {
  source: 'injected'
  type: 'ETH_REQUEST'
  id: number
  method: string
  params: unknown[]
}

export interface EthResponseMessage {
  source: 'background'
  type: 'ETH_RESPONSE'
  id: number
  result?: unknown
  error?: { code: number; message: string }
}

export interface AccountsChangedMessage {
  source: 'background'
  type: 'ACCOUNTS_CHANGED'
  accounts: string[]
}

export interface ChainChangedMessage {
  source: 'background'
  type: 'CHAIN_CHANGED'
  chainId: string
}

export interface StoreVaultMessage {
  source: 'ui'
  type: 'STORE_VAULT'
  mnemonic: string
  password: string
  address: string
}

export interface UnlockVaultMessage {
  source: 'ui'
  type: 'UNLOCK_VAULT'
  password: string
}

export interface LockVaultMessage {
  source: 'ui'
  type: 'LOCK_VAULT'
}

export interface GetWalletStateMessage {
  source: 'ui'
  type: 'GET_WALLET_STATE'
}

export interface VaultResponseMessage {
  source: 'background'
  type: 'VAULT_RESPONSE'
  ok: boolean
  error?: string
  address?: string
}

export interface WalletStateMessage {
  source: 'background'
  type: 'WALLET_STATE'
  initialized: boolean
  unlocked: boolean
  address?: string
}

export interface CreateAddressMessage {
  source: 'ui'
  type: 'CREATE_ADDRESS'
  password: string
}

export interface SelectAddressMessage {
  source: 'ui'
  type: 'SELECT_ADDRESS'
  address: string
}

export interface GetBalanceMessage {
  source: 'ui'
  type: 'GET_BALANCE'
  address: string
}

export interface BalanceResponseMessage {
  source: 'background'
  type: 'BALANCE_RESPONSE'
  ok: boolean
  balance?: string
  error?: string
}

export interface ConvertToCurrencyMessage {
  source: 'ui'
  type: 'CONVERT_TO_CURRENCY'
  id: string
  vs_currency: string
}

export interface CurrencyConversionResponseMessage {
  source: 'background'
  type: 'CURRENCY_CONVERSION_RESPONSE'
  ok: boolean
  price?: number
  error?: string
}

export type ExtensionMessage =
  | EthRequestMessage
  | EthResponseMessage
  | AccountsChangedMessage
  | ChainChangedMessage
  | StoreVaultMessage
  | UnlockVaultMessage
  | LockVaultMessage
  | GetWalletStateMessage
  | VaultResponseMessage
  | WalletStateMessage
  | CreateAddressMessage
  | SelectAddressMessage
  | GetBalanceMessage
  | BalanceResponseMessage
  | ConvertToCurrencyMessage
  | CurrencyConversionResponseMessage
