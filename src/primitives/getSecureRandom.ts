import { getEngine } from './getEngine';

export async function getSecureRandomBytes(size: number): Promise<Buffer> {
    let engine = getEngine();
    if (engine.type === 'node') {
        return engine.crypto.randomBytes(size);
    } else if (engine.type === 'browser') {
        return Buffer.from(window.crypto.getRandomValues(new Uint8Array(size)));
    } else if (engine.type === 'expo') {
        return Buffer.from(await engine.random.getRandomBytesAsync(size));
    } else {
        throw Error('Unsupported');
    }
}

export async function getSecureRandomWords(size: number): Promise<Uint16Array> {
    let engine = getEngine();
    if (engine.type === 'node') {
        let res = new Uint16Array(size);
        engine.crypto.randomFillSync(res);
        return res;
    } else if (engine.type === 'browser') {
        return window.crypto.getRandomValues(new Uint16Array(size));
    } else if (engine.type === 'expo') {
        let buffer = Buffer.from(await engine.random.getRandomBytesAsync(size * 2));
        return new Uint16Array(buffer, 0, size * 2);
    } else {
        throw Error('Unsupported');
    }
}