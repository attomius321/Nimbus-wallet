import './router'

chrome.runtime.onInstalled.addListener(() => {
  if ('sidePanel' in chrome) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(console.error)
  }
})
