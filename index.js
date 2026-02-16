import serialize from 'error-serialize';

/**
Create a custom error class with a specific name and error code.

@param {string} name - The error class name.
@param {string} code - The error code.
@param {object} [options] - Options for the error class.
@param {ErrorConstructor} [options.parent] - The parent error class to extend.
@returns {Function} A custom error class.
*/
export function createErrorClass(name, code, options = {}) {
	const Parent = options.parent ?? Error;

	class CustomError extends Parent {
		constructor(message, errorOptions = {}) {
			super(message, errorOptions.cause ? {cause: errorOptions.cause} : undefined);
			this.name = name;
			this.code = code;

			if (errorOptions.data !== undefined) {
				this.data = errorOptions.data;
			}

			if (errorOptions.cause !== undefined) {
				this.cause = errorOptions.cause;
			}
		}

		toJSON() {
			const json = {
				name: this.name,
				code: this.code,
				message: this.message,
				stack: this.stack,
			};

			if (this.data !== undefined) {
				json.data = this.data;
			}

			if (this.cause !== undefined) {
				json.cause = this.cause instanceof Error
					? serialize(this.cause)
					: this.cause;
			}

			return json;
		}
	}

	Object.defineProperty(CustomError, 'name', {value: name});

	return CustomError;
}

/**
Check if an error has a specific error code.

@param {unknown} error - The error to check.
@param {string} code - The error code to match.
@returns {boolean} True if the error has the given code.
*/
export function isErrorWithCode(error, code) {
	return error instanceof Error && /** @type {any} */ (error).code === code;
}
