export type ErrorWithCode = {
	readonly name: string;
	readonly code: string;
	readonly message: string;
	readonly data?: unknown;
	readonly cause?: unknown;
	readonly stack?: string;

	toJSON(): { // eslint-disable-line @typescript-eslint/naming-convention
		name: string;
		code: string;
		message: string;
		stack?: string;
		data?: unknown;
		cause?: unknown;
	};
} & Error;

export type ErrorWithCodeConstructor = new (message: string, options?: {cause?: unknown; data?: unknown}) => ErrorWithCode;

export type CreateErrorClassOptions = {
	/**
	The parent error class to extend.

	@default Error
	*/
	readonly parent?: ErrorConstructor;
};

/**
Create a custom error class with a specific name and error code.

@param name - The error class name.
@param code - The error code.
@param options - Options for the error class.
@returns A custom error class constructor.

@example
```
import {createErrorClass} from 'error-with-cause';

const NotFoundError = createErrorClass('NotFoundError', 'ERR_NOT_FOUND');
throw new NotFoundError('User not found', {data: {userId: 123}});
```
*/
export function createErrorClass(
	name: string,
	code: string,
	options?: CreateErrorClassOptions,
): ErrorWithCodeConstructor;

/**
Check if an error has a specific error code.

@param error - The error to check.
@param code - The error code to match.
@returns True if the error has the given code.

@example
```
import {createErrorClass, isErrorWithCode} from 'error-with-cause';

const NotFoundError = createErrorClass('NotFoundError', 'ERR_NOT_FOUND');
const error = new NotFoundError('missing');

isErrorWithCode(error, 'ERR_NOT_FOUND');
//=> true
```
*/
export function isErrorWithCode(error: unknown, code: string): error is ErrorWithCode;
