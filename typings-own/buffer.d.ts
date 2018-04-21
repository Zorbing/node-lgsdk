// extend Buffer instance
interface Buffer
{
	/** Get the memory address of buffer. */
	address(): number;
	/** Get the memory address of buffer as hex number. */
	hexAddress(): number;
	/** Check the NULL. */
	isNull(): boolean;
	/** Create pointer to buffer. */
	ref(): Buffer;
	/**
	 * Get value after dereferencing buffer.
	 * That is, first it checks the indirection count of buffer's type, and
	 * if it's greater than 1 then it merely returns another Buffer, but with
	 * one level less indirection.
	 */
	deref<T = any>(): T;
	/** Read a JS Object that has previously been written. */
	readObject(offset?: number): object;
	/**
	 * Write the JS Object. This function "attaches" object to buffer to prevent
	 * it from being garbage collected.
	 */
	writeObject(object: object, offset: number): void;
	/** Read data from the pointer. */
	readPointer(offset?: number, length?: number): Buffer;
	/**
	 * Write the memory address of pointer to buffer at the specified offset. This
	 * function "attaches" object to buffer to prevent it from being garbage collected.
	 */
	writePointer(pointer: Buffer, offset: number): void;
	/** Read C string until the first NULL. */
	readCString(offset?: number): string;
	/** Write the string as a NULL terminated. Default encoding is utf8. */
	writeCString(string: string, offset: number, encoding?: string): void;
	/**
	 * Read a big-endian signed 64-bit int.
	 * If there is losing precision, then return a string, otherwise a number.
	 * @return {number|string}
	 */
	readInt64BE(offset?: number): number | string;
	/** Write a big-endian signed 64-bit int. */
	writeInt64BE(input: number | string, offset: number): void;
	/**
	 * Read a big-endian unsigned 64-bit int.
	 * If there is losing precision, then return a string, otherwise a number.
	 * @return {number|string}
	 */
	readUInt64BE(offset?: number): number | string;
	/** Write a big-endian unsigned 64-bit int. */
	writeUInt64BE(input: number | string, offset: number): void;
	/**
	 * Read a little-endian signed 64-bit int.
	 * If there is losing precision, then return a string, otherwise a number.
	 * @return {number|string}
	 */
	readInt64LE(offset?: number): number | string;
	/** Write a little-endian signed 64-bit int. */
	writeInt64LE(input: number | string, offset: number): void;
	/**
	 * Read a little-endian unsigned 64-bit int.
	 * If there is losing precision, then return a string, otherwise a number.
	 * @return {number|string}
	 */
	readUInt64LE(offset?: number): number | string;
	/** Write a little-endian unsigned 64-bit int. */
	writeUInt64LE(input: number | string, offset: number): void;
	/**
	 * Returns a new Buffer instance that has the same memory address
	 * as the given buffer, but with the specified size.
	 */
	reinterpret(size: number, offset?: number): Buffer;
	/** Same as ref.reinterpretUntilZeros, except that this version does not attach buffer. */
	/**
	 * Returns a new Buffer instance that has the same memory address
	 * as the given buffer, but with a length up to the first aligned set of values of
	 * 0 in a row for the given length.
	 */
	reinterpretUntilZeros(size: number, offset?: number): Buffer;
}
