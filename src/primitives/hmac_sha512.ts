import { getEngine } from './getEngine';
import jsSHA from 'jssha';

export async function hmac_sha512_fallback(key: string | Buffer, data: string | Buffer): Promise<Buffer> {
    let keyBuffer: Buffer = typeof key === 'string' ? Buffer.from(key, 'utf-8') : key;
    let dataBuffer: Buffer = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;
    const shaObj = new jsSHA("SHA-512", "HEX", {
        hmacKey: { value: keyBuffer.toString('hex'), format: "HEX" },
    });
    shaObj.update(dataBuffer.toString('hex'));
    const hmac = shaObj.getHash("HEX");
    return Buffer.from(hmac, 'hex');
}

export async function hmac_sha512(key: string | Buffer, data: string | Buffer): Promise<Buffer> {
    let keyBuffer: Buffer = typeof key === 'string' ? Buffer.from(key, 'utf-8') : key;
    let dataBuffer: Buffer = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;

    let engine = getEngine();
    if (engine.type === 'node') {
        return engine.crypto.createHmac('sha512', keyBuffer)
            .update(dataBuffer)
            .digest();
    } else if (engine.type === 'browser') {
        const hmacAlgo = { name: "HMAC", hash: "SHA-512" };
        const hmacKey = await window.crypto.subtle.importKey("raw", keyBuffer, hmacAlgo, false, ["sign"]);
        return Buffer.from(await crypto.subtle.sign(hmacAlgo, hmacKey, dataBuffer));
    } else {
        return hmac_sha512_fallback(key, data);
    }
}