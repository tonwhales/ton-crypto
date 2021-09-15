import sjcl from "sjcl";
import { getEngine } from "./getEngine";

export async function sha512(source: Buffer | string): Promise<Buffer> {
    const engine = getEngine();
    if (engine.type === 'node') {
        return engine.crypto.createHash('sha512').update(source).digest();
    } else if (engine.type === 'browser') {
        if (typeof source === 'string') {
            return Buffer.from(await crypto.subtle.digest("SHA-512", Buffer.from(source, 'utf-8')));
        }
        return Buffer.from(await crypto.subtle.digest("SHA-512", source));
    } else if (engine.type === 'expo') {
        let src: string;
        if (typeof source === 'string') {
            src = Buffer.from(source, 'utf-8').toString('base64');
        } else {
            src = source.toString('base64');
        }
        var bitArray = sjcl.codec.base64.toBits(src);
        let hash = sjcl.hash.sha256.hash(bitArray);
        return Buffer.from(sjcl.codec.base64.fromBits(hash), 'base64');
    } else {
        throw Error('Unsupported');
    }
}