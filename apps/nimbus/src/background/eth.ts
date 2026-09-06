import { errorMessage, rpcCall } from './rpc'

export async function getBalance(address: string, sendResponse: (response: unknown) => void) {
  try {
    const result = await rpcCall<string>('eth_getBalance', [address, 'latest'])
    const wei = BigInt(result ?? '0x0')
    const eth = (Number(wei) / 1e18).toFixed(6)
    sendResponse({ source: 'background', type: 'BALANCE_RESPONSE', ok: true, balance: eth })
  } catch (e) {
    sendResponse({
      source: 'background',
      type: 'BALANCE_RESPONSE',
      ok: false,
      error: errorMessage(e),
    })
  }
}

export async function convertToCurrency(
  id: string,
  vs_currency: string,
  value: number,
  sendResponse: (response: unknown) => void
) {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=${vs_currency}`
    )
    const json = await res.json()
    const price: number = json[id]?.[vs_currency]
    if (price) {
      sendResponse({
        source: 'background',
        type: 'CURRENCY_CONVERSION_RESPONSE',
        ok: true,
        price: price * value,
      })
    } else {
      sendResponse({
        source: 'background',
        type: 'CURRENCY_CONVERSION_RESPONSE',
        ok: false,
        error: 'Price not found in response',
      })
    }
  } catch (e) {
    sendResponse({
      source: 'background',
      type: 'CURRENCY_CONVERSION_RESPONSE',
      ok: false,
      error: errorMessage(e),
    })
  }
}
