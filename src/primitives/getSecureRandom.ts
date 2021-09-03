const nodeCrypto: (typeof import('crypto')) = typeof window === 'undefined' ? require('crypto') : null;

export async function getSecureRandomBytes(size: number): Promise<Buffer> {
    if (nodeCrypto) {
        return nodeCrypto.randomBytes(size);
    } else {
        return Buffer.from(window.crypto.getRandomValues(new Uint8Array(size)));
    }
}

export async function getSecureRandomWords(size: number): Promise<Uint16Array> {
    if (nodeCrypto) {
        let res = new Uint16Array(size);
        nodeCrypto.randomFillSync(res);
        return res;
    } else {
        return window.crypto.getRandomValues(new Uint16Array(size));
    }
}