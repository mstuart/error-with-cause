import {expectType} from 'tsd';
import {
	createErrorClass,
	isErrorWithCode,
	type ErrorWithCode,
	type ErrorWithCodeConstructor,
} from './index.js';

const notFoundError = createErrorClass('NotFoundError', 'ERR_NOT_FOUND');
expectType<ErrorWithCodeConstructor>(notFoundError);

const error = new notFoundError('not found'); // eslint-disable-line new-cap
expectType<ErrorWithCode>(error);
expectType<string>(error.code);
expectType<string>(error.message);
expectType<string>(error.name);

const json = error.toJSON();
expectType<string>(json.name);
expectType<string>(json.code);
expectType<string>(json.message);

// With options
const errorWithData = new notFoundError('not found', {data: {id: 1}, cause: new Error('root')}); // eslint-disable-line new-cap
expectType<ErrorWithCode>(errorWithData);

// IsErrorWithCode type guard
const unknown_: unknown = new notFoundError('test'); // eslint-disable-line new-cap
if (isErrorWithCode(unknown_, 'ERR_NOT_FOUND')) {
	expectType<ErrorWithCode>(unknown_);
	expectType<string>(unknown_.code);
}

// With parent class
const customParent = createErrorClass('ParentError', 'ERR_PARENT', {parent: TypeError});
expectType<ErrorWithCodeConstructor>(customParent);
