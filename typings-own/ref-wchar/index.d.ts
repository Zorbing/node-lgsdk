// Type definitions for ref-wchar@1.0.2
// Project: https://github.com/TooTallNate/ref-wchar
// Definitions by: Martin Boekhoff <https://github.com/Zorbing>
// TypeScript version: 2.8

/// <reference path="../../node_modules/@types/ref/index.d.ts" />

/** extends ref.types.int16 or ref.types.int32 */
declare module 'ref-wchar'
{
	import ref = require('ref');

	/** extends ref.types.CString */
	interface WCString extends ref.Type
	{
		/** The name to use during debugging for this datatype. */
		name: 'WCString';
		/** To invoke when `ref.get` is invoked on a buffer of this type. */
		get(buffer: Buffer, offset: number): string | null;
		/** To invoke when `ref.set` is invoked on a buffer of this type. */
		set(buffer: Buffer, offset: number, value: string | Buffer): void;
	}


    /** The name to use during debugging for this datatype. */
	export var name: 'wchar_t';
    /** The size in bytes required to hold this datatype. */
	export var size: 2 | 4 | number;
    /** The current level of indirection of the buffer. */
	export var indirection: number;
    /** To invoke when `ref.get` is invoked on a buffer of this type. */
	export function get(buffer: Buffer, offset: number): any;
    /** To invoke when `ref.set` is invoked on a buffer of this type. */
	export function set(buffer: Buffer, offset: number, value: any): void;
    /** The alignment of this datatype when placed inside a struct. */
	export var alignment: number | undefined;

	export var string: WCString;

	/**
	 * Turns a `wchar_t *` Buffer instance into a JavaScript String instance.
	 *
	 * @param {Buffer} buffer - buffer instance to serialize
	 */
	export function toString(buffer: Buffer): string;
}
