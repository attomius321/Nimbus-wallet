import { N } from "@/constants/index.js"

export function validateAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export function validatePrivateKey(privateKey: Uint8Array): boolean {
    const d = BigInt('0x' + toHex(privateKey))
    return d > 0n && d < N
}

export function toHex(bytes: Uint8Array): string {
    return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
}

// Base64 encoding/decoding for ArrayBuffers, since btoa/atob only work with strings
export function b64(buf: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(buf)))
}

// Base64 decoding to Uint8Array
export function unb64(s: string): Uint8Array<ArrayBuffer> {
    return new Uint8Array(Array.from(atob(s), (c) => c.charCodeAt(0))) as Uint8Array<ArrayBuffer>
}

