export interface EncryptedVault {
  ciphertext: string; // base64
  iv: string; // base64
  salt: string; // base64
}
