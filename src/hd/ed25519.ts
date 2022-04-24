import { hmac_sha512 } from "../primitives/hmac_sha512";
import { HDKeysState } from "./state";

const ED25519_CURVE = 'ed25519 seed';
const HARDENED_OFFSET = 0x80000000;

export async function getED25519MasterKeyFromSeed(seed: Buffer): Promise<HDKeysState> {
    const I = await hmac_sha512(ED25519_CURVE, seed);
    const IL = I.slice(0, 32);
    const IR = I.slice(32);
    return {
        key: IL,
        chainCode: IR,
    };
};

export async function deriveED25519HardenedKey(parent: HDKeysState, index: number): Promise<HDKeysState> {
    if (index >= HARDENED_OFFSET) {
        throw Error('Key index must be less than offset');
    }

    // Key Derive Path: 0x00 + parent.key + index;
    const indexBuffer = Buffer.alloc(4);
    indexBuffer.writeUInt32BE(index + HARDENED_OFFSET, 0);
    const data = Buffer.concat([Buffer.alloc(1, 0), parent.key, indexBuffer]);

    // Derive key
    const I = await hmac_sha512(parent.chainCode, data);
    const IL = I.slice(0, 32);
    const IR = I.slice(32);
    return {
        key: IL,
        chainCode: IR,
    };
};

export async function deriveEd25519Path(seed: Buffer, path: number[]) {
    let state = await getED25519MasterKeyFromSeed(seed);
    let remaining = [...path];
    while (remaining.length > 0) {
        let index = remaining[0];
        remaining = remaining.slice(1);
        state = await deriveED25519HardenedKey(state, index);
    }
    return state.key;
}