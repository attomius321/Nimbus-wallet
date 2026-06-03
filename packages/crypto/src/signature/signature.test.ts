import { describe, it, expect } from "vitest";
import {
  generateSignatureForEthereum,
  verifySignature,
  recoverAddressForEthereum,
} from "./index.js";

const MNEMONIC = "test test test test test test test test test test test junk";
const MESSAGE = "Hello Ethereum";

describe("generateSignatureForEthereum", () => {
  it("returns a 0x-prefixed 65-byte hex string", () => {
    const sig = generateSignatureForEthereum(MESSAGE, MNEMONIC, 0);
    expect(sig).toMatch(/^0x[0-9a-f]{130}$/);
  });

  it("is deterministic for same inputs", () => {
    const sig1 = generateSignatureForEthereum(MESSAGE, MNEMONIC, 0);
    const sig2 = generateSignatureForEthereum(MESSAGE, MNEMONIC, 0);
    expect(sig1).toBe(sig2);
  });

  it("differs for different account indexes", () => {
    const sig0 = generateSignatureForEthereum(MESSAGE, MNEMONIC, 0);
    const sig1 = generateSignatureForEthereum(MESSAGE, MNEMONIC, 1);
    expect(sig0).not.toBe(sig1);
  });
});

describe("verifySignature", () => {
  it("returns true for the correct signer address", () => {
    const sig = generateSignatureForEthereum(MESSAGE, MNEMONIC, 0);
    const address = recoverAddressForEthereum(MESSAGE, sig);
    expect(verifySignature(MESSAGE, sig, address)).toBe(true);
  });

  it("returns false for a wrong address", () => {
    const sig = generateSignatureForEthereum(MESSAGE, MNEMONIC, 0);
    expect(
      verifySignature(
        MESSAGE,
        sig,
        "0x000000000000000000000000000000000000dead",
      ),
    ).toBe(false);
  });

  it("returns false for a tampered message", () => {
    const sig = generateSignatureForEthereum(MESSAGE, MNEMONIC, 0);
    const address = recoverAddressForEthereum(MESSAGE, sig);
    expect(verifySignature("Tampered message", sig, address)).toBe(false);
  });
});
