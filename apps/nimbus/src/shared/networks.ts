export type NetworkId = 'mainnet' | 'sepolia'

export interface Network {
  id: NetworkId
  name: string
  /** Decimal chain id. Hex form is what JSON-RPC returns from eth_chainId. */
  chainId: number
  /** Keyless public endpoint. Overridable per user via storage.rpcUrl. */
  rpcUrl: string
  explorerUrl: string
  currencySymbol: string
  testnet: boolean
}

export const NETWORKS: Record<NetworkId, Network> = {
  mainnet: {
    id: 'mainnet',
    name: 'Ethereum Mainnet',
    chainId: 1,
    rpcUrl: 'https://ethereum-rpc.publicnode.com',
    explorerUrl: 'https://etherscan.io',
    currencySymbol: 'ETH',
    testnet: false,
  },
  sepolia: {
    id: 'sepolia',
    name: 'Sepolia',
    chainId: 11155111,
    rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
    explorerUrl: 'https://sepolia.etherscan.io',
    currencySymbol: 'SepoliaETH',
    testnet: true,
  },
}

export const DEFAULT_NETWORK: NetworkId = 'sepolia'

export function isNetworkId(value: unknown): value is NetworkId {
  return typeof value === 'string' && value in NETWORKS
}

/**
 * A user-supplied endpoint must be https, or plain http on loopback so a local
 * node (anvil, hardhat) still works in development.
 */
export function isValidRpcUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false
  let url: URL
  try {
    url = new URL(value)
  } catch {
    return false
  }
  if (url.protocol === 'https:') return true
  return url.protocol === 'http:' && (url.hostname === 'localhost' || url.hostname === '127.0.0.1')
}
