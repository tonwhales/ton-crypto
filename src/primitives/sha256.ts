const nodeCrypto: (typeof import('crypto')) = typeof window === 'undefined' ? require('crypto') : null;
const expoCrypto: (typeof import('expo-crypto')) = (typeof navigator !== 'undefined' && navigator.product == 'ReactNative') ? require('expo-crypto') : null;

export async function sha256(source: Buffer | string): Promise<Buffer> {
    if (nodeCrypto) {
        return nodeCrypto.createHash('sha256').update(source).digest();
    } else if (expoCrypto) {
        let src: string;
        if (typeof source === 'string') {
            src = Buffer.from(source, 'utf-8').toString('base64');
        } else {
            src = source.toString('base64');
        }
        let res = await expoCrypto.digestStringAsync(expoCrypto.CryptoDigestAlgorithm.SHA256, src, { encoding: expoCrypto.CryptoEncoding.BASE64 });
        return Buffer.from(res, 'base64');
    } else {
        if (typeof source === 'string') {
            return Buffer.from(await crypto.subtle.digest("SHA-256", Buffer.from(source, 'utf-8')));
        }
        return Buffer.from(await crypto.subtle.digest("SHA-256", source));
    }
}