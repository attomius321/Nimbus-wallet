import { PASSPHRASE, N } from "@/constants/index.js";
import { toCheckSumAddress, toHex } from "@/helpers/index.js";
import { secp256k1 } from "@noble/curves/secp256k1.js";
import { keccak_256 } from "@noble/hashes/sha3.js";
import { HDKey } from "@scure/bip32";
import {
  generateMnemonic,
  mnemonicToSeedSync,
  validateMnemonic,
} from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";

/**
 * Generates a new Ethereum wallet with a random mnemonic or uses an existing one.
 * @param initialMnemonic
 * @returns mnemonic and the first derived address
 * @throws if the provided mnemonic is invalid, or if the derived private key is invalid
 */
export function generateWallet(initialMnemonic?: string): {
  mnemonic: string;
  address: string;
} {
  if (
    initialMnemonic &&
    validateMnemonic(initialMnemonic, wordlist) === false
  ) {
    throw new Error("Invalid mnemonic");
  }
  const mnemonic = initialMnemonic || generateMnemonic(wordlist, 128);
  const seed = mnemonicToSeedSync(mnemonic, PASSPHRASE);
  const root = HDKey.fromMasterSeed(seed);
  const account = root.derive("m/44'/60'/0'/0/0");

  if (!account.privateKey) {
    throw new Error("Missing private key");
  }

  const privateKey = account.privateKey;
  const d = BigInt("0x" + toHex(privateKey));

  if (d <= 0n || d >= N) {
    throw new Error("Invalid private key");
  }

  const publicKey = secp256k1.getPublicKey(privateKey, false); // uncompressed
  const hash = keccak_256(publicKey.slice(1)); // drop 0x04 prefix
  const address = toCheckSumAddress("0x" + toHex(hash.slice(-20)));

  return { mnemonic, address };
}

/**
 * Derives the private key for a specific account index from a mnemonic.
 * @param mnemonic
 * @param accountIndex
 * @returns private key for the given account index, derived from the mnemonic using the standard Ethereum HD path m/44'/60'/0'/0/{accountIndex}
 * @throws if the derived private key is invalid
 */
export function derivePrivateKeyForAccount(
  mnemonic: string,
  accountIndex: number,
): Uint8Array {
  const seed = mnemonicToSeedSync(mnemonic, PASSPHRASE);
  const root = HDKey.fromMasterSeed(seed);
  const account = root.derive(`m/44'/60'/0'/0/${accountIndex}`);

  if (!account.privateKey) {
    throw new Error("Missing private key");
  }

  const privateKey = account.privateKey;
  const d = BigInt("0x" + toHex(privateKey));

  if (d <= 0n || d >= N) {
    throw new Error("Invalid private key");
  }

  return privateKey;
}
