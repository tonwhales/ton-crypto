import { newSecureWords } from "..";

describe('newSecurePassword', () => {
    it('should generate password', async () => {
        let pass = await newSecureWords();
        expect(pass.length).toBe(6);
    })
});