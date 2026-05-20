import { N, PASSPHRASE } from "@/constants/index.js";
import { toCheckSumAddress, toHex } from "@/helpers/index.js";
import { secp256k1 } from "@noble/curves/secp256k1.js";
import { keccak_256 } from "@noble/hashes/sha3.js";
import { HDKey } from "@scure/bip32";
import { mnemonicToSeedSync } from "@scure/bip39";

export function generateAccount(mnemonic: string, accountIndex: number) {
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

  const publicKey = secp256k1.getPublicKey(privateKey, false); // uncompressed
  const hash = keccak_256(publicKey.slice(1)); // drop 0x04 prefix
  const address = toCheckSumAddress("0x" + toHex(hash.slice(-20)));

  return { address };
}
