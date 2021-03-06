import { getSecureRandomNumber } from "..";

describe('getSecureRandom', () => {
    it('should generate correct numbers', async () => {
        for (let i = 0; i < 1000; i++) {
            let r = await getSecureRandomNumber(0, 10);
            expect(r).toBeGreaterThanOrEqual(0);
            expect(r).toBeLessThan(10);
        }
    });
});