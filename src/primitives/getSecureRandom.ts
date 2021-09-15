import { getEngine } from './getEngine';

export async function getSecureRandomBytes(size: number): Promise<Buffer> {
    let engine = getEngine();
    if (engine.type === 'node') {
        return engine.crypto.randomBytes(size);
    } else if (engine.type === 'browser') {
        return Buffer.from(window.crypto.getRandomValues(new Uint8Array(size)));
    } else if (engine.type === 'fallback') {
        return Buffer.from(window.crypto.getRandomValues(new Uint8Array(size)));
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
    } else if (engine.type === 'fallback') {
        return window.crypto.getRandomValues(new Uint16Array(size));
    } else {
        throw Error('Unsupported');
    }
}