export function getEngine(): { type: 'browser' } | { type: 'node', crypto: typeof import('crypto') } | { type: 'fallback' } {
    if (typeof window === 'undefined') {
        let pname = '';
        let x = ['c', 'r', 'y', 'p', 'to']
        for (let i = 0; i < x.length; ++i) {
            pname += x[i];
        };
        return { type: 'node', crypto: require(pname) };
    } else if (typeof window.crypto !== 'undefined' && typeof window.crypto.subtle !== 'undefined') {
        return { type: 'browser' };
    } else {
        return { type: 'fallback' };
    }
}