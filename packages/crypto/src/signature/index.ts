import { derivePrivateKeyForAccount } from "@/wallet/index.js";
import { secp256k1 } from "@noble/curves/secp256k1.js";
import { keccak_256 } from "@noble/hashes/sha3.js";
import { utf8ToBytes, concatBytes } from "@noble/hashes/utils.js";

export function generateSignatureForEthereum(
  message: string,
  mnemonic: string,
  accountIndex: number,
) {
  const k = derivePrivateKeyForAccount(mnemonic, accountIndex);
  const hashedMessage = hashMessage(message);
  const sigBytes = secp256k1.sign(hashedMessage, k, { format: "recovered" });
  const hex = Array.from(sigBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const v = (27 + sigBytes[64]!).toString(16).padStart(2, "0");
  return "0x" + hex.slice(0, 128) + v;
}

export function verifySignature(
  message: string,
  signature: string,
  address: string,
): boolean {
  return (
    recoverAddressForEthereum(message, signature).toLowerCase() ===
    address.toLowerCase()
  );
}

export function recoverAddressForEthereum(message: string, signature: string): string {
  const hashedMessage = hashMessage(message);
  const hex = signature.replace(/^0x/, "");
  const v = parseInt(hex.slice(128, 130), 16);
  const recovery = v - 27;
  const sigBytes = Uint8Array.from(
    hex
      .slice(0, 128)
      .match(/.{2}/g)!
      .map((b) => parseInt(b, 16)),
  );
  const recovered65 = Uint8Array.from([...sigBytes, recovery]);
  const pubKey = secp256k1.recoverPublicKey(recovered65, hashedMessage);
  const pubKeyHash = keccak_256(pubKey.slice(1));
  return (
    "0x" +
    Array.from(pubKeyHash.slice(-20))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
}

function hashMessage(message: string): Uint8Array {
  const msg = utf8ToBytes(message);
  const prefix = utf8ToBytes(`\x19Ethereum Signed Message:\n${msg.length}`);
  return keccak_256(concatBytes(prefix, msg));
}
