import { hmac_sha512 } from "../primitives/hmac_sha512";
import { HDKeysState } from "./state";

const SYMMETRIC_SEED = 'Symmetric key seed';

export async function getSymmetricMasterKeyFromSeed(seed: Buffer): Promise<HDKeysState> {
    const I = await hmac_sha512(SYMMETRIC_SEED, seed);
    const IL = I.slice(32);
    const IR = I.slice(0, 32);
    return {
        key: IL,
        chainCode: IR,
    };
};

export async function deriveSymmetricHardenedKey(parent: HDKeysState, offset: string): Promise<HDKeysState> {

    // Prepare data
    const data = Buffer.concat([Buffer.alloc(1, 0), Buffer.from(offset)]);

    // Derive key
    const I = await hmac_sha512(parent.chainCode, data);
    const IL = I.slice(32);
    const IR = I.slice(0, 32);
    return {
        key: IL,
        chainCode: IR,
    };
}

export async function deriveSymmetricPath(seed: Buffer, path: string[]) {
    let state = await getSymmetricMasterKeyFromSeed(seed);
    let remaining = [...path];
    while (remaining.length > 0) {
        let index = remaining[0];
        remaining = remaining.slice(1);
        state = await deriveSymmetricHardenedKey(state, index);
    }
    return state.key;
}