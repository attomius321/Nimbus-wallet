## Nimbus wallet

Non-custodial browser wallet extension for Ethereum and EVM-compatible chains.

Uses standard secp256k1 keys with BIP-44 derivation 
<pre>
m / purpose' / coin_type' / account' / change / address_index
</pre>
with coin_type hardcoded to Ethereum.

### Features

1. Create HD wallet (BIP-39 mnemonic generation)
2. Import HD wallet from existing mnemonic
3. Encrypt vault with AES-GCM, key derived via PBKDF2 (600k iterations)
4. Lock/unlock
5. Chrome side panel + firefox popup support

### Security

1. Mnemonic encrypted at rest with AES-GCM
2. Private key derived on demand, never stored
3. In-memory session cleared on lock
4. Background script isolated from web content via content script

### Tech stack

1. React 19 + React router
2. Vite + Turborepo monorepo
3. @noble/curves / @noble/hashes for cryptography
4. Chrome MV3 (service worker) + Firefox MV3 (background page)

### Known limitations

1. Chrome MV3 service workers terminate after ~30s of inactivity, wiping in-memory session state. A keepalive mechanism is required to maintain the unlocked session (maybe heartbeat would be a solution)