const RPC_URL = `https://mainnet.infura.io/v3/${import.meta.env.VITE_INFURA_KEY}`

export async function getBalance(address: string, sendResponse: (response: unknown) => void) {
  try {
    const res = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [address, 'latest'],
        id: 1,
      }),
    })
    const json = (await res.json()) as { result?: string; error?: { message: string } }
    if (json.error) {
      sendResponse({
        source: 'background',
        type: 'BALANCE_RESPONSE',
        ok: false,
        error: json.error.message,
      })
      return
    }
    const wei = BigInt(json.result ?? '0x0')
    const eth = (Number(wei) / 1e18).toFixed(6)
    sendResponse({ source: 'background', type: 'BALANCE_RESPONSE', ok: true, balance: eth })
  } catch (e) {
    sendResponse({ source: 'background', type: 'BALANCE_RESPONSE', ok: false, error: String(e) })
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
      error: String(e),
    })
  }
}
