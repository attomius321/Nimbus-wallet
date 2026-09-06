import {
  DEFAULT_NETWORK,
  NETWORKS,
  isNetworkId,
  isValidRpcUrl,
  type Network,
} from '../shared/networks'
import { getStorage } from '../shared/storage'

export class RpcError extends Error {
  readonly code?: number

  constructor(message: string, code?: number) {
    super(message)
    this.name = 'RpcError'
    this.code = code
  }
}

/** Falls back to the default whenever storage holds nothing or something unrecognized. */
export async function getActiveNetwork(): Promise<Network> {
  const { network } = await getStorage(['network'])
  return NETWORKS[isNetworkId(network) ? network : DEFAULT_NETWORK]
}

/** The user's own endpoint when they set one, otherwise the network's public default. */
export async function getRpcUrl(): Promise<string> {
  const [{ rpcUrl }, network] = await Promise.all([getStorage(['rpcUrl']), getActiveNetwork()])
  return isValidRpcUrl(rpcUrl) ? rpcUrl : network.rpcUrl
}

let nextRequestId = 1

export async function rpcCall<T>(method: string, params: unknown[] = []): Promise<T> {
  const url = await getRpcUrl()
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method, params, id: nextRequestId++ }),
  })

  if (!res.ok) {
    throw new RpcError(`RPC request failed: ${res.status} ${res.statusText}`)
  }

  const json = (await res.json()) as {
    result?: T
    error?: { message: string; code?: number }
  }

  if (json.error) {
    throw new RpcError(json.error.message, json.error.code)
  }

  return json.result as T
}

export function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}
