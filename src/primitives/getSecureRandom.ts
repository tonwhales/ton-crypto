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

export async function getSecureRandomNumber(min: number, max: number) {

    let range = max - min;
    var bitsNeeded = Math.ceil(Math.log2(range));
    if (bitsNeeded > 53) {
        throw new Error('Range is too large');
    }
    var bytesNeeded = Math.ceil(bitsNeeded / 8);
    var mask = Math.pow(2, bitsNeeded) - 1;

    while (true) {
        let res = await getSecureRandomBytes(bitsNeeded);
        let power = (bytesNeeded - 1) * 8;
        let numberValue = 0;
        for (var i = 0; i < bytesNeeded; i++) {
            numberValue += res[i] * Math.pow(2, power);
            power -= 8;
        }
        numberValue = numberValue & mask; // Truncate
        if (numberValue >= range) {
            continue;
        }
        return min + numberValue;
    }
}