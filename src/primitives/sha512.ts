import sjcl from "sjcl";
import { getEngine } from "./getEngine";

export async function sha512_fallback(source: Buffer | string): Promise<Buffer> {
    let src: string;
    if (typeof source === 'string') {
        src = Buffer.from(source, 'utf-8').toString('hex');
    } else {
        src = source.toString('hex');
    }
    var bitArray = sjcl.codec.hex.toBits(src);
    let hash = sjcl.hash.sha512.hash(bitArray);
    return Buffer.from(sjcl.codec.hex.fromBits(hash), 'hex');
}

export async function sha512(source: Buffer | string): Promise<Buffer> {
    const engine = getEngine();
    if (engine.type === 'node') {
        return engine.crypto.createHash('sha512').update(source).digest();
    } else if (engine.type === 'browser') {
        if (typeof source === 'string') {
            return Buffer.from(await crypto.subtle.digest("SHA-512", Buffer.from(source, 'utf-8')));
        }
        return Buffer.from(await crypto.subtle.digest("SHA-512", source));
    }
    return sha512_fallback(source);
}