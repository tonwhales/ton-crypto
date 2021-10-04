import { getSecureRandomNumber } from "../primitives/getSecureRandom";
import { wordlist } from "./wordlist";

export async function newSecureWords(size: number = 6) {
    let words: string[] = [];
    for (let i = 0; i < size; i++) {
        words.push(wordlist[await getSecureRandomNumber(0, wordlist.length - 1)]);
    }
    return words;
}