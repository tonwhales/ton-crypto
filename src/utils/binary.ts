export function lpad(str: string, padString: string, length: number): string {
    while (str.length < length) {
        str = padString + str;
    }
    return str;
}

export function bytesToBits(bytes: Buffer) {
    let res = '';
    for (let i = 0; i < bytes.length; i++) {
        let x = bytes.at(i)!;
        res += lpad(x.toString(2), '0', 8);
    }
    return res;
}

export function bitsToBytes(src: string) {
    if (src.length % 8 !== 0) {
        throw Error('Uneven bits');
    }
    let res: number[] = [];
    while (src.length > 0) {
        res.push(parseInt(src.slice(0, 8), 2));
        src = src.slice(8);
    }
    return Buffer.from(res);
}