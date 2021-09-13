import nacl from 'tweetnacl';
import { getSecureRandomWords } from '../primitives/getSecureRandom';
import { hmac_sha512 } from '../primitives/hmac_sha512';
import { KeyPair } from '../primitives/nacl';
import { pbkdf2_sha512 } from '../primitives/pbkdf2_sha512';
import { wordlist } from './wordlist';

const PBKDF_ITERATIONS = 100000;

async function isPasswordNeeded(mnemonicArray: string[]) {
    const passlessEntropy = await mnemonicToEntropy(mnemonicArray);
    return (await isPasswordSeed(passlessEntropy)) && !(await isBasicSeed(passlessEntropy));
}

function normalizeMnemonic(src: string[]) {
    return src.map((v) => v.toLowerCase().trim());
}

async function isBasicSeed(entropy: Buffer | string) {
    // https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/tonlib/tonlib/keys/Mnemonic.cpp#L68
    // bool Mnemonic::is_basic_seed() {
    //   td::SecureString hash(64);
    //   td::pbkdf2_sha512(as_slice(to_entropy()), "TON seed version", td::max(1, PBKDF_ITERATIONS / 256),
    //                     hash.as_mutable_slice());
    //   return hash.as_slice()[0] == 0;
    // }
    const seed = await pbkdf2_sha512(entropy, 'TON seed version', Math.max(1, Math.floor(PBKDF_ITERATIONS / 256)), 64);
    return seed[0] == 0;
}

async function isPasswordSeed(entropy: Buffer | string) {
    // https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/tonlib/tonlib/keys/Mnemonic.cpp#L75
    // bool Mnemonic::is_password_seed() {
    //   td::SecureString hash(64);
    //   td::pbkdf2_sha512(as_slice(to_entropy()), "TON fast seed version", 1, hash.as_mutable_slice());
    //   return hash.as_slice()[0] == 1;
    // }
    const seed = await pbkdf2_sha512(entropy, 'TON fast seed version', 1, 64);
    return seed[0] == 1;
}

export async function mnemonicToEntropy(mnemonicArray: string[], password?: string | null | undefined) {
    // https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/tonlib/tonlib/keys/Mnemonic.cpp#L52
    // td::SecureString Mnemonic::to_entropy() const {
    //   td::SecureString res(64);
    //   td::hmac_sha512(join(words_), password_, res.as_mutable_slice());
    //   return res;
    // }
    return await hmac_sha512(mnemonicArray.join(' '), password && password.length > 0 ? password : '');
}

export async function mnemonicToSeed(mnemonicArray: string[], seed: string, password?: string | null | undefined) {
    // https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/tonlib/tonlib/keys/Mnemonic.cpp#L58
    // td::SecureString Mnemonic::to_seed() const {
    //   td::SecureString hash(64);
    //   td::pbkdf2_sha512(as_slice(to_entropy()), "TON default seed", PBKDF_ITERATIONS, hash.as_mutable_slice());
    //   return hash;
    // }
    const entropy = await mnemonicToEntropy(mnemonicArray, password);
    const res = await pbkdf2_sha512(entropy, seed, PBKDF_ITERATIONS, 64);
    return res.slice(0, 32);
}

/**
 * Extract private key from mnemonic
 * @param mnemonicArray mnemonic array
 * @param password mnemonic password
 * @returns Key Pair
 */
export async function mnemonicToPrivateKey(mnemonicArray: string[], password?: string | null | undefined): Promise<KeyPair> {
    // https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/tonlib/tonlib/keys/Mnemonic.cpp#L64
    // td::Ed25519::PrivateKey Mnemonic::to_private_key() const {
    //   return td::Ed25519::PrivateKey(td::SecureString(as_slice(to_seed()).substr(0, td::Ed25519::PrivateKey::LENGTH)));
    // }
    mnemonicArray = normalizeMnemonic(mnemonicArray);
    const seed = (await mnemonicToSeed(mnemonicArray, 'TON default seed', password));
    let keyPair = nacl.sign.keyPair.fromSeed(seed);
    return {
        publicKey: Buffer.from(keyPair.publicKey),
        secretKey: Buffer.from(keyPair.secretKey)
    };
}

/**
 * Convert mnemonic to wallet key pair
 * @param mnemonicArray mnemonic array
 * @param password mnemonic password
 * @returns Key Pair
 */
export async function mnemonicToWalletKey(mnemonicArray: string[], password?: string | null | undefined): Promise<KeyPair> {
    let seedPk = await mnemonicToPrivateKey(mnemonicArray, password);
    let seedSecret = seedPk.secretKey.slice(0, 32);
    const keyPair = nacl.sign.keyPair.fromSeed(seedSecret);
    return {
        publicKey: Buffer.from(keyPair.publicKey),
        secretKey: Buffer.from(keyPair.secretKey)
    };
}

/**
 * Validate Mnemonic
 * @param mnemonicArray mnemonic array
 * @param password mnemonic password
 * @returns true for valid mnemonic
 */
export async function mnemonicValidate(mnemonicArray: string[], password?: string | null | undefined) {

    // Normalize
    mnemonicArray = normalizeMnemonic(mnemonicArray);

    // Validate mnemonic words
    for (let word of mnemonicArray) {
        if (wordlist.indexOf(word) < 0) {
            return false;
        }
    }

    // Check password
    if (password && password.length > 0) {
        if (!await isPasswordNeeded(mnemonicArray)) {
            return false;
        }
    }

    // Validate seed
    return await isBasicSeed(await mnemonicToEntropy(mnemonicArray, password));
}

/**
 * Generate new Mnemonic
 * @param wordsCount number of words to generate
 * @param password mnemonic password
 * @returns 
 */
export async function mnemonicNew(wordsCount: number = 24, password?: string | null | undefined) {

    // https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/tonlib/tonlib/keys/Mnemonic.cpp#L159

    let mnemonicArray: string[] = [];
    while (true) {

        // Regenerate new mnemonics
        mnemonicArray = [];
        const rnd = await getSecureRandomWords(wordsCount);
        for (let i = 0; i < wordsCount; i++) {
            mnemonicArray.push(wordlist[rnd[i] & 2047]); // We loose 5 out of 16 bits of entropy here, good enough
        }

        // Chek password conformance
        if (password && password.length > 0) {
            if (!await isPasswordNeeded(mnemonicArray)) {
                continue;
            }
        }

        // Check if basic seed correct
        if (!(await isBasicSeed(await mnemonicToEntropy(mnemonicArray, password)))) {
            continue;
        }
        break;
    }
    return mnemonicArray;
}