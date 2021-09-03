let nodeCrypto: any = null;
if (typeof window === 'undefined') {
    nodeCrypto = require('crypto');
}

export async function sha512(source: Buffer | string): Promise<Buffer> {
    if (typeof window === 'undefined') {
        return nodeCrypto.createHash('sha512').update(source).digest();
    } else {
        if (typeof source === 'string') {
            return Buffer.from(await crypto.subtle.digest("SHA-512", Buffer.from(source, 'utf-8')));
        }
        return Buffer.from(await crypto.subtle.digest("SHA-512", source));
    }
}