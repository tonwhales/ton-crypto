export function getEngine(): { type: 'browser' } | { type: 'node', crypto: typeof import('crypto') } | { type: 'expo', crypto: any, random: any } {
    if (typeof window === 'undefined') {
        let pname = '';
        let x = ['c', 'r', 'y', 'p', 'to']
        for (let i = 0; i < x.length; ++i) {
            pname += x[i];
        };
        return { type: 'node', crypto: require(pname) };
    } else if (typeof navigator !== 'undefined' && navigator.product == 'ReactNative') {
        return { type: 'expo', crypto: require('expo-crypto'), random: require('expo-random') };
    } else {
        return { type: 'browser' };
    }
}