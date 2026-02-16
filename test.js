import test from 'ava';
import {createErrorClass, isErrorWithCode} from './index.js';

// CreateErrorClass tests

test('createErrorClass returns a class', t => {
	const MyError = createErrorClass('MyError', 'ERR_MY');
	t.is(typeof MyError, 'function');
	t.is(MyError.name, 'MyError');
});

test('instances have correct name', t => {
	const MyError = createErrorClass('MyError', 'ERR_MY');
	const error = new MyError('test');
	t.is(error.name, 'MyError');
});

test('instances have correct code', t => {
	const MyError = createErrorClass('MyError', 'ERR_MY');
	const error = new MyError('test');
	t.is(error.code, 'ERR_MY');
});

test('instances have correct message', t => {
	const MyError = createErrorClass('MyError', 'ERR_MY');
	const error = new MyError('something went wrong');
	t.is(error.message, 'something went wrong');
});

test('instances are instanceof Error', t => {
	const MyError = createErrorClass('MyError', 'ERR_MY');
	const error = new MyError('test');
	t.true(error instanceof Error);
});

test('instances are instanceof the created class', t => {
	const MyError = createErrorClass('MyError', 'ERR_MY');
	const error = new MyError('test');
	t.true(error instanceof MyError);
});

test('cause chain is preserved', t => {
	const MyError = createErrorClass('MyError', 'ERR_MY');
	const rootCause = new Error('root cause');
	const error = new MyError('wrapper', {cause: rootCause});
	t.is(error.cause, rootCause);
});

test('data property is set', t => {
	const MyError = createErrorClass('MyError', 'ERR_MY');
	const error = new MyError('test', {data: {userId: 42}});
	t.deepEqual(error.data, {userId: 42});
});

test('data property is undefined when not provided', t => {
	const MyError = createErrorClass('MyError', 'ERR_MY');
	const error = new MyError('test');
	t.is(error.data, undefined);
});

test('cause is undefined when not provided', t => {
	const MyError = createErrorClass('MyError', 'ERR_MY');
	const error = new MyError('test');
	t.is(error.cause, undefined);
});

// ToJSON tests

test('toJSON returns correct structure', t => {
	const MyError = createErrorClass('MyError', 'ERR_MY');
	const error = new MyError('test');
	const json = error.toJSON();
	t.is(json.name, 'MyError');
	t.is(json.code, 'ERR_MY');
	t.is(json.message, 'test');
	t.is(typeof json.stack, 'string');
});

test('toJSON includes data when present', t => {
	const MyError = createErrorClass('MyError', 'ERR_MY');
	const error = new MyError('test', {data: {key: 'value'}});
	const json = error.toJSON();
	t.deepEqual(json.data, {key: 'value'});
});

test('toJSON excludes data when not present', t => {
	const MyError = createErrorClass('MyError', 'ERR_MY');
	const error = new MyError('test');
	const json = error.toJSON();
	t.false('data' in json);
});

test('toJSON includes cause when present', t => {
	const MyError = createErrorClass('MyError', 'ERR_MY');
	const error = new MyError('test', {cause: new Error('root')});
	const json = error.toJSON();
	t.truthy(json.cause);
});

test('toJSON excludes cause when not present', t => {
	const MyError = createErrorClass('MyError', 'ERR_MY');
	const error = new MyError('test');
	const json = error.toJSON();
	t.false('cause' in json);
});

test('toJSON serializes non-Error cause directly', t => {
	const MyError = createErrorClass('MyError', 'ERR_MY');
	const error = new MyError('test', {cause: 'string cause'});
	const json = error.toJSON();
	t.is(json.cause, 'string cause');
});

// Custom parent tests

test('custom parent class', t => {
	const MyTypeError = createErrorClass('MyTypeError', 'ERR_TYPE', {parent: TypeError});
	const error = new MyTypeError('bad type');
	t.true(error instanceof TypeError);
	t.true(error instanceof Error);
	t.is(error.name, 'MyTypeError');
	t.is(error.code, 'ERR_TYPE');
});

test('different error classes are distinct', t => {
	const ErrorA = createErrorClass('ErrorA', 'ERR_A');
	const ErrorB = createErrorClass('ErrorB', 'ERR_B');
	const a = new ErrorA('a');
	const b = new ErrorB('b');
	t.true(a instanceof ErrorA);
	t.false(a instanceof ErrorB);
	t.true(b instanceof ErrorB);
	t.false(b instanceof ErrorA);
});

// IsErrorWithCode tests

test('isErrorWithCode returns true for matching code', t => {
	const MyError = createErrorClass('MyError', 'ERR_MY');
	const error = new MyError('test');
	t.true(isErrorWithCode(error, 'ERR_MY'));
});

test('isErrorWithCode returns false for wrong code', t => {
	const MyError = createErrorClass('MyError', 'ERR_MY');
	const error = new MyError('test');
	t.false(isErrorWithCode(error, 'ERR_OTHER'));
});

test('isErrorWithCode returns false for plain Error', t => {
	const error = new Error('test');
	t.false(isErrorWithCode(error, 'ERR_MY'));
});

test('isErrorWithCode returns false for non-Error', t => {
	t.false(isErrorWithCode('not an error', 'ERR_MY'));
	t.false(isErrorWithCode(null, 'ERR_MY'));
	t.false(isErrorWithCode(undefined, 'ERR_MY'));
	t.false(isErrorWithCode(42, 'ERR_MY'));
});

test('isErrorWithCode works with manually set code', t => {
	const error = new Error('test');
	error.code = 'MANUAL_CODE';
	t.true(isErrorWithCode(error, 'MANUAL_CODE'));
});

test('stack trace is present', t => {
	const MyError = createErrorClass('MyError', 'ERR_MY');
	const error = new MyError('test');
	t.is(typeof error.stack, 'string');
	t.true(error.stack.length > 0);
});

test('nested cause chain', t => {
	const InnerError = createErrorClass('InnerError', 'ERR_INNER');
	const OuterError = createErrorClass('OuterError', 'ERR_OUTER');
	const inner = new InnerError('inner');
	const outer = new OuterError('outer', {cause: inner});
	t.is(outer.cause.code, 'ERR_INNER');
	t.is(outer.cause.message, 'inner');
});

test('both data and cause together', t => {
	const MyError = createErrorClass('MyError', 'ERR_MY');
	const error = new MyError('test', {
		cause: new Error('root'),
		data: {extra: true},
	});
	t.deepEqual(error.data, {extra: true});
	t.true(error.cause instanceof Error);
});
