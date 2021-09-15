import { getEngine } from "./getEngine";

export async function pbkdf2_sha512(key: string | Buffer, salt: string | Buffer, iterations: number, keyLen: number): Promise<Buffer> {
    const engine = getEngine();
    if (engine.type === 'node') {
        return await new Promise<Buffer>((resolve, reject) => engine.crypto.pbkdf2(key, salt, iterations, keyLen, 'sha512', (error, derivedKey) => {
            if (error) {
                reject(error);
            } else {
                resolve(derivedKey);
            }
        }));
    } else if (engine.type === 'browser') {
        const keyBuffer = typeof key === 'string' ? Buffer.from(key, 'utf-8') : key;
        const saltBuffer = typeof salt === 'string' ? Buffer.from(salt, 'utf-8') : salt;
        const pbkdf2_key = await window.crypto.subtle.importKey("raw", keyBuffer, { name: "PBKDF2" }, false, ["deriveBits"]);
        const derivedBits = await window.crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-512", salt: saltBuffer, iterations: iterations }, pbkdf2_key, keyLen * 8);
        return Buffer.from(derivedBits);
    } else {
        const keyBuffer = typeof key === 'string' ? Buffer.from(key, 'utf-8') : key;
        const saltBuffer = typeof salt === 'string' ? Buffer.from(salt, 'utf-8') : salt;
        let pbkdf2 = require('react-native-fast-pbkdf2');
        let res = await pbkdf2.derive(keyBuffer.toString('base64'), saltBuffer.toString('base64'), 1, 16, 'sha-512');
        return Buffer.from(res, 'base64');
    }
}