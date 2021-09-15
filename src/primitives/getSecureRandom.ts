const nodeCrypto: (typeof import('crypto')) = typeof window === 'undefined' ? require('crypto') : null;
const expoRandom: (typeof import('expo-random')) = (typeof navigator !== 'undefined' && navigator.product == 'ReactNative') ? require('expo-random') : null;

export async function getSecureRandomBytes(size: number): Promise<Buffer> {
    if (nodeCrypto) {
        return nodeCrypto.randomBytes(size);
    } if (expoRandom) {
        return Buffer.from(await expoRandom.getRandomBytesAsync(size));
    } else {
        return Buffer.from(window.crypto.getRandomValues(new Uint8Array(size)));
    }
}

export async function getSecureRandomWords(size: number): Promise<Uint16Array> {
    if (nodeCrypto) {
        let res = new Uint16Array(size);
        nodeCrypto.randomFillSync(res);
        return res;
    } else if (expoRandom) {
        let buffer = Buffer.from(await expoRandom.getRandomBytesAsync(size * 2));
        return new Uint16Array(buffer, 0, size * 2);
    } else {
        return window.crypto.getRandomValues(new Uint16Array(size));
    }
}