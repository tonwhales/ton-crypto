let nodeCrypto: (typeof import('crypto')) | null = null;
if (typeof window === 'undefined') {
    nodeCrypto = require('crypto');
}

export async function hmac_sha512(key: string | Buffer, data: string | Buffer): Promise<Buffer> {
    let keyBuffer: Buffer = typeof key === 'string' ? Buffer.from(key, 'utf-8') : key;
    let dataBuffer: Buffer = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;
    if (nodeCrypto) {
        return nodeCrypto.createHmac('sha512', keyBuffer)
            .update(dataBuffer)
            .digest();
    } else {
        const hmacAlgo = { name: "HMAC", hash: "SHA-512" };
        const hmacKey = await window.crypto.subtle.importKey("raw", keyBuffer, hmacAlgo, false, ["sign"]);
        return Buffer.from(await crypto.subtle.sign(hmacAlgo, hmacKey, dataBuffer));
    }
}