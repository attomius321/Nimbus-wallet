export interface VaultKdfParams {
  iterations: number;
  hash: "SHA-256" | "SHA-384" | "SHA-512";
  keyLen: 128 | 256;
}

export interface EncryptedVault {
  ciphertext: string; // base64
  iv: string; // base64
  salt: string; // base64
  params?: VaultKdfParams; // KDF params used at encryption time; absent on pre-migration vaults
}
