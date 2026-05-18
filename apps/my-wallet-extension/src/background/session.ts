/**
 * TO DO: Move to e short lived storage/offscreen page (WIP)
 * Extension Service workers are ephemeral and can be killed by the browser when not in use.
 * This module is used to store the session information (mnemonic and address) in memory while the service worker is alive.
 * When the service worker is killed, the session information will be lost and the user will have to unlock the vault again.
 */

let sessionMnemonic: string | null = null
let sessionAddress: string | null = null

export function getSessionMnemonic() {
  return sessionMnemonic
}

export function getSessionAddress() {
  return sessionAddress
}

export function setSession(mnemonic: string, address: string) {
  sessionMnemonic = mnemonic
  sessionAddress = address
}

export function lockVault() {
  sessionMnemonic = null
  sessionAddress = null
}

export function isUnlocked() {
  return sessionMnemonic !== null
}
