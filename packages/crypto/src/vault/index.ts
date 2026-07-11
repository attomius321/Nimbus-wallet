import { b64, unb64 } from "@/helpers/index.js";
import type { EncryptedVault, VaultKdfParams } from "@/types.js";

// Params used when encrypting new vaults. Existing vaults keep whatever params
// they were encrypted with (stored in vault.params) so decryption still works
// after this default changes.
const DEFAULT_KDF_PARAMS: VaultKdfParams = {
  iterations: 600_000,
  hash: "SHA-256",
  keyLen: 256,
};

// Derive a key from the password and salt using PBKDF2, then use it to encrypt/decrypt the mnemonic with AES-GCM
async function deriveKey(
  password: string,
  salt: Uint8Array,
  params: VaultKdfParams,
): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt.buffer as ArrayBuffer,
      iterations: params.iterations,
      hash: params.hash,
    },
    baseKey,
    { name: "AES-GCM", length: params.keyLen },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encryptMnemonic(
  mnemonic: string,
  password: string,
): Promise<EncryptedVault> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const params = DEFAULT_KDF_PARAMS;
  const key = await deriveKey(password, salt, params);
  const enc = new TextEncoder();
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(mnemonic),
  );
  return {
    ciphertext: b64(ciphertext),
    iv: b64(iv.buffer as ArrayBuffer),
    salt: b64(salt.buffer as ArrayBuffer),
    params,
  };
}

export async function decryptMnemonic(
  vault: EncryptedVault,
  password: string,
): Promise<string> {
  const salt = unb64(vault.salt);
  const iv = unb64(vault.iv);
  const params = vault.params ?? DEFAULT_KDF_PARAMS;
  const key = await deriveKey(password, salt, params);
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    unb64(vault.ciphertext),
  );
  return new TextDecoder().decode(plain);
}
