import { pbkdf2_sha512 as internal } from 'ton-crypto-primitives';

export function pbkdf2_sha512(key: string | Buffer, salt: string | Buffer, iterations: number, keyLen: number): Promise<Buffer> {
    return internal(key, salt, iterations, keyLen);
}