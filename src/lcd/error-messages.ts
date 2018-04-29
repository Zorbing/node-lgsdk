/**
 * @license
 * The MIT License (MIT)
 *
 * Copyright 2018 Martin Boekhoff
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

export const errorMsg = {
	alreadyInitialized: 'The LCD-connection is already established.',
	bitmapLength: (num) => `The bitmap must contain ${num} elements`,
	bitmapRange: 'The bitmap must contain only bytes. Allowed values are: 0-255',
	buttonId: 'The given button does not exist.',
	colorByte: 'Each color must be a byte (allowed values: 0-255)',
	lineId: (num, max) => `Not allowed value "${num}" for line number. Allowed values are: 0-${max}`,
	lineIdNotInteger: 'The line number must be an integer.',
	notInitialized: 'The LCD-connection is not yet initialized. Please call `init`.',
};
