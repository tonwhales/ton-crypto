import { getEngine } from "./getEngine";

export async function sha256(source: Buffer | string): Promise<Buffer> {
    const engine = getEngine();
    if (engine.type === 'node') {
        return engine.crypto.createHash('sha256').update(source).digest();
    } else if (engine.type === 'browser') {
        if (typeof source === 'string') {
            return Buffer.from(await crypto.subtle.digest("SHA-256", Buffer.from(source, 'utf-8')));
        }
        return Buffer.from(await crypto.subtle.digest("SHA-256", source));
    } else if (engine.type === 'expo') {
        let src: string;
        if (typeof source === 'string') {
            src = Buffer.from(source, 'utf-8').toString('base64');
        } else {
            src = source.toString('base64');
        }
        let res = await engine.crypto.digestStringAsync(engine.crypto.CryptoDigestAlgorithm.SHA256, src, { encoding: engine.crypto.CryptoEncoding.BASE64 });
        return Buffer.from(res, 'base64');
    } else {
        throw Error('Unsupported');
    }
}