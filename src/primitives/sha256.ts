import jsSHA from 'jssha';
import { getEngine } from "./getEngine";

export async function sha256_fallback(source: Buffer | string): Promise<Buffer> {
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

export async function sha256(source: Buffer | string): Promise<Buffer> {
    const engine = getEngine();
    if (engine.type === 'node') {
        return engine.crypto.createHash('sha256').update(source).digest();
    } else if (engine.type === 'browser') {
        if (typeof source === 'string') {
            return Buffer.from(await crypto.subtle.digest("SHA-256", Buffer.from(source, 'utf-8')));
        }
        return Buffer.from(await crypto.subtle.digest("SHA-256", source));
    }
    return sha256_fallback(source);
}