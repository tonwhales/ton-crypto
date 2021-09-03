# TON blockchain crypto primitives for NodeJS and Browser

Cross-platform crypto primitives for building TON apps. Uses native crypto available in NodeJS or in browser.

## Features

- 🦺Crypto primitives: SHA-256, SHA-512, PBKDF2-SHA-256, HMAC-SHA-512
- 🚀Promise-based API
- 🏎Built on top of Buffer (polifil required in browsers)
- 🍰No reimplemented crypto

## Install

```bash
yarn add ton-crypto buffer
```

#### Browser polifil

```js
// Add before using library
require("buffer");
```

## Methods
All methods accept strings or Buffers as arguments.

```js
import { sha256, sha512, pbkdf2_sha512 } from 'ton-crypto';
const hash1 = await sha256('hello-world');
const hash2 = await sha512(Buffer.from('hello-world', 'utf-8'));
const key = await pbkdf2_sha512('password', 'salt', 10000, 64);
const hmac = await hmac_sha512('hmac-key', 'data');
```

# License

MIT
