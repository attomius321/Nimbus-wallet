import type { EthRequestMessage, EthResponseMessage } from '../shared/messages'

// Inject the in-page provider before any page scripts run
function injectProvider() {
  const script = document.createElement('script')
  script.type = 'module'
  script.src = chrome.runtime.getURL('injected.js')
  ;(document.head || document.documentElement).prepend(script)
  script.onload = () => script.remove()
}

injectProvider()

// Bridge: page → extension background
window.addEventListener('message', (event) => {
  if (event.source !== window) return
  const msg = event.data as EthRequestMessage
  if (msg?.source !== 'injected' || msg?.type !== 'ETH_REQUEST') return

  chrome.runtime.sendMessage(msg)
})

// Bridge: extension background → page
chrome.runtime.onMessage.addListener((message: EthResponseMessage) => {
  if (message.type !== 'ETH_RESPONSE' && message.type !== 'ACCOUNTS_CHANGED' && message.type !== 'CHAIN_CHANGED') return
  window.postMessage(message, '*')
})
