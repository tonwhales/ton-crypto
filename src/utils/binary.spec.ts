import { bitsToBytes, bytesToBits } from "./binary";

describe('binary', () => {
    it('should encode to bits', () => {
        expect(bytesToBits(Buffer.from([0]))).toEqual('00000000');
        expect(bytesToBits(Buffer.from([1]))).toEqual('00000001');
        expect(bytesToBits(Buffer.from([2]))).toEqual('00000010');
        expect(bytesToBits(Buffer.from([3]))).toEqual('00000011');
        expect(bytesToBits(Buffer.from([255]))).toEqual('11111111');
        expect(bytesToBits(Buffer.from([0, 0]))).toEqual('0000000000000000');
        expect(bytesToBits(Buffer.from([0, 1]))).toEqual('0000000000000001');
        expect(bytesToBits(Buffer.from([1, 0]))).toEqual('0000000100000000');
        expect(bytesToBits(Buffer.from([0, 255]))).toEqual('0000000011111111');
        expect(bytesToBits(Buffer.from([255, 0]))).toEqual('1111111100000000');
    });
    it('should decode from bits', () => {
        let cases: number[][] = [];
        for (let i = 0; i < 256; i++) {
            cases.push([i]);
            cases.push([i, 0]);
            cases.push([i, 255]);
            cases.push([255, i]);
            cases.push([0, i]);
            cases.push([255, i, 255]);
            cases.push([0, i, 0]);
            cases.push([255, i, 0]);
            cases.push([0, i, 255]);
            cases.push([255, i, i]);
            cases.push([i, i, 255]);
        }

        for (let cs of cases) {
            let source = Buffer.from(cs);
            let bits = bytesToBits(source);
            let decoded = bitsToBytes(bits);
            expect(source.equals(decoded)).toBe(true);
        }
    });
});