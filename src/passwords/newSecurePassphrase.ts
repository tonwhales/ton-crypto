import { newSecureWords } from "..";

export async function newSecurePassphrase(size: number = 6) {
    return (await newSecureWords(size)).join('-');
}