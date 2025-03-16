import { PublicKey } from "@solana/web3.js";

export function verifyCA(_address: string): boolean {
    if (!_address) return false;
    try {
        const address = new PublicKey(_address);
        return PublicKey.isOnCurve(address)
    } catch {
        return false
    }
}
