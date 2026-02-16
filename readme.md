# error-with-cause

> Create typed error classes with error codes, cause chains, and type guards

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
