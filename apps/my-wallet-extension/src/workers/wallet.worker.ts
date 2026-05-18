import { generateWallet } from '@repo/crypto'

/**
 * Worker used to generate a new wallet from a mnemonic, which can be a CPU-intensive operation.
 * By offloading it to a worker, we can keep the UI responsive.
 * Even though the user does not have many actions to perform during this time.
 **/
self.onmessage = (event) => {
  try {
    const result = generateWallet(event.data.mnemonic)
    self.postMessage({ ok: true, ...result })
  } catch (error) {
    self.postMessage({ ok: false, error: (error as Error).message })
  }
}
