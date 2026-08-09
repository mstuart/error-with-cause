<div align="center">
  <img src="docs/assets/logo.svg" alt="error-with-cause — Create typed error classes with error codes, cause chains, and type guards" width="720">
</div>

<p align="center"><strong>Create typed error classes with error codes, cause chains, and type guards</strong></p>

<p align="center">
  <a href="https://github.com/mstuart/error-with-cause/actions/workflows/main.yml"><img src="https://github.com/mstuart/error-with-cause/actions/workflows/main.yml/badge.svg" alt="CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://www.npmjs.com/package/error-with-cause"><img src="https://img.shields.io/npm/v/error-with-cause?label=npm" alt="npm"></a>
  <a href="https://deepwiki.com/mstuart/error-with-cause"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki"></a>
  <a href="https://socket.dev/npm/package/error-with-cause"><img src="https://socket.dev/api/badge/npm/package/error-with-cause" alt="Socket"></a>
  <img src="https://img.shields.io/badge/node-%E2%89%A520-339933.svg" alt="Node 20+">
</p>

---
## Install

```sh
npm install error-with-cause
```

## Usage

```js
import {createErrorClass, isErrorWithCode} from 'error-with-cause';

const NotFoundError = createErrorClass('NotFoundError', 'ERR_NOT_FOUND');

try {
	throw new NotFoundError('User not found', {
		data: {userId: 123},
		cause: new Error('DB lookup failed'),
	});
} catch (error) {
	if (isErrorWithCode(error, 'ERR_NOT_FOUND')) {
		console.log(error.code); // 'ERR_NOT_FOUND'
		console.log(error.data); // {userId: 123}
		console.log(error.toJSON()); // Serialized error object
	}
}
```

## API

### createErrorClass(name, code, options?)

Returns a custom error class constructor.

#### name

Type: `string`

The error class name.

#### code

Type: `string`

The error code.

#### options

Type: `object`

##### parent

Type: `ErrorConstructor`\
Default: `Error`

The parent error class to extend.

### isErrorWithCode(error, code)

Type guard that returns `true` if `error` is an `Error` with a matching `.code` property.

## Related

- [error-serialize](https://github.com/mstuart/error-serialize) - Serialize errors to plain objects

## License

MIT
