/**
 * @module node-lgsdk/lcd
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
import * as ffi from 'ffi';
import * as ref from 'ref';
import * as ArrayType from 'ref-array';
import * as wchar_t from 'ref-wchar';

import { libPath } from '../path';
import {
    COLOR_BITMAP_LENGTH,
    COLOR_BUTTON_CANCEL,
    COLOR_BUTTON_DOWN,
    COLOR_BUTTON_LEFT,
    COLOR_BUTTON_MENU,
    COLOR_BUTTON_OK,
    COLOR_BUTTON_RIGHT,
    COLOR_BUTTON_UP,
    MONO_BITMAP_LENGTH,
    MONO_BUTTON_0,
    MONO_BUTTON_1,
    MONO_BUTTON_2,
    MONO_BUTTON_3,
} from './constants';


/**
 * @hidden
 */
const byte = ref.types.uchar;
/**
 * @hidden
 */
const byteArray = ArrayType<number>(byte);
/**
 * @hidden
 */
const wchar_string = wchar_t.string;


/**
 * @private
 */
interface LcdLib
{
	LogiLcdInit: Function;
	LogiLcdIsConnected: Function;
	LogiLcdIsButtonPressed: Function;
	LogiLcdUpdate: Function;
	LogiLcdShutdown: Function;

	// Monochrome LCD functions
	LogiLcdMonoSetBackground: Function;
	LogiLcdMonoSetText: Function;

	// Color LCD functions
	LogiLcdColorSetBackground: Function;
	LogiLcdColorSetTitle: Function;
	LogiLcdColorSetText: Function;
}

/**
 * The `node-ffi` instance which is linked to the lcd library file.
 */
export const lcdLib: LcdLib = ffi.Library(libPath('lcd'), {
	'LogiLcdInit': ['bool', [wchar_string /*friendlyName*/, 'int' /*lcdType*/]],
	'LogiLcdIsConnected': ['bool', ['int' /*lcdType*/]],
	'LogiLcdIsButtonPressed': ['bool', ['int' /*button*/]],
	'LogiLcdUpdate': ['void', []],
	'LogiLcdShutdown': ['void', []],

	// Monochrome LCD functions
	'LogiLcdMonoSetBackground': ['bool', [byteArray /*monoBitmap[]*/]],
	'LogiLcdMonoSetText': ['bool', ['int' /*lineNumber*/, wchar_string /*text*/]],

	// Color LCD functions
	'LogiLcdColorSetBackground': ['bool', [byteArray /*colorBitmap[]*/]],
	'LogiLcdColorSetTitle': ['bool', [wchar_string /*text*/, 'int' /*red = 255*/, 'int' /*green = 255*/, 'int' /*blue = 255*/]],
	'LogiLcdColorSetText': ['bool', ['int' /*lineNumber*/, wchar_string /*text*/, 'int' /*red = 255*/, 'int' /*green = 255*/, 'int' /*blue = 255*/]],
});

/**
 * Checks if the given button number is a valid button number for either color devices or monochrome devices.
 *
 * @param button The number to check.
 */
export function isButtonValid(button: number)
{
	return isButtonValidForColor(button) || isButtonValidForMono(button);
}

/**
 * Checks if the given button number is a valid button number for monochrome devices.
 *
 * @param button The number to check.
 */
export function isButtonValidForMono(button: number)
{
	return button === MONO_BUTTON_0
		|| button === MONO_BUTTON_1
		|| button === MONO_BUTTON_2
		|| button === MONO_BUTTON_3
	;
}

/**
 * Checks if the given button number is a valid button number for color devices.
 *
 * @param button The number to check.
 */
export function isButtonValidForColor(button: number)
{
	return button === COLOR_BUTTON_LEFT
		|| button === COLOR_BUTTON_RIGHT
		|| button === COLOR_BUTTON_OK
		|| button === COLOR_BUTTON_CANCEL
		|| button === COLOR_BUTTON_UP
		|| button === COLOR_BUTTON_DOWN
		|| button === COLOR_BUTTON_MENU
	;
}

/**
 * Checks if the given bitmap array has the correct length for color devices.
 *
 * @param bitmap The bitmap array to check.
 */
export function isValidColorBitmapLength(bitmap: number[])
{
	return bitmap.length === COLOR_BITMAP_LENGTH;
}

/**
 * Checks if the given bitmap array has the correct length for monochrome devices.
 *
 * @param bitmap The bitmap array to check.
 */
export function isValidMonoBitmapLength(bitmap: number[])
{
	return bitmap.length === MONO_BITMAP_LENGTH;
}

/**
 * Checks if all entries of the given bitmap array are valid values.
 * They are supposed to be bytes which means they allow values from 0-255.
 *
 * @param bitmap The bitmap array to check.
 */
export function isValidBitmapValues(bitmap: number[])
{
	return bitmap.every((byte) => (byte & 255) === byte);
}
