import jsSHA from 'jssha'
import { sha512 as internal } from 'ton-crypto-primitives';

export async function sha512_fallback(source: Buffer | string): Promise<Buffer> {
    let src: string;
    if (typeof source === 'string') {
        src = Buffer.from(source, 'utf-8').toString('hex');
    } else {
        src = source.toString('hex');
    }

    let hasher = new jsSHA('SHA-512', 'HEX');
    hasher.update(src);
    let res = hasher.getHash('HEX');
    return Buffer.from(res, 'hex');
}

export async function sha512(source: Buffer | string): Promise<Buffer> {
    return internal(source);
}