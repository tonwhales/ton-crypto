import jsSHA from 'jssha';
import { sha256 as internal } from 'ton-crypto-primitives';

export function sha256_sync(source: Buffer | string): Buffer {
    let src: string;
    if (typeof source === 'string') {
        src = Buffer.from(source, 'utf-8').toString('hex');
    } else {
        src = source.toString('hex');
    }

    let hasher = new jsSHA('SHA-256', 'HEX');
    hasher.update(src);
    let res = hasher.getHash('HEX');
    return Buffer.from(res, 'hex');
}

export async function sha256_fallback(source: Buffer | string): Promise<Buffer> {
    return sha256_sync(source);
}

export function sha256(source: Buffer | string): Promise<Buffer> {
    return internal(source);
}