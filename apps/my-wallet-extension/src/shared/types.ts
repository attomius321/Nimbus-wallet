export interface Account {
  address: string
  label?: string
}

export interface Network {
  chainId: number
  name: string
  rpcUrl: string
  symbol: string
  explorerUrl?: string
}

export const NETWORKS: Record<number, Network> = {
  1: {
    chainId: 1,
    name: 'Ethereum',
    rpcUrl: 'https://cloudflare-eth.com',
    symbol: 'ETH',
    explorerUrl: 'https://etherscan.io',
  },
  11155111: {
    chainId: 11155111,
    name: 'Sepolia',
    rpcUrl: 'https://rpc.sepolia.org',
    symbol: 'SepoliaETH',
    explorerUrl: 'https://sepolia.etherscan.io',
  },
}

export type WalletView = 'dashboard' | 'send' | 'receive' | 'settings' | 'unlock'
