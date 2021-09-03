const nodeCrypto: (typeof import('crypto')) = typeof window === 'undefined' ? require('crypto') : null;

export async function sha256(source: Buffer | string): Promise<Buffer> {
    if (nodeCrypto) {
        return nodeCrypto.createHash('sha256').update(source).digest();
    } else {
        if (typeof source === 'string') {
            return Buffer.from(await crypto.subtle.digest("SHA-256", Buffer.from(source, 'utf-8')));
        }
        return Buffer.from(await crypto.subtle.digest("SHA-256", source));
    }
}