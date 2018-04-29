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

import * as ffi from 'ffi';
import * as ref from 'ref';
import * as ArrayType from 'ref-array';
import * as wchar_t from 'ref-wchar';

import { libPath } from '../path';
import { LOGI_LCD, BITMAP_LENGTH_COLOR, BITMAP_LENGTH_MONO } from './constants';


const byte = ref.types.uchar;
const byteArray = ArrayType<number>(byte);
const wchar_string = wchar_t.string;


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

export function isButtonValid(button: number)
{
	return isButtonValidForColor(button) || isButtonValidForMono(button);
}

export function isButtonValidForMono(button: number)
{
	return button === LOGI_LCD.mono.buttons['0']
		|| button === LOGI_LCD.mono.buttons['1']
		|| button === LOGI_LCD.mono.buttons['2']
		|| button === LOGI_LCD.mono.buttons['3']
	;
}

export function isButtonValidForColor(button: number)
{
	return button === LOGI_LCD.color.buttons['left']
		|| button === LOGI_LCD.color.buttons['right']
		|| button === LOGI_LCD.color.buttons['ok']
		|| button === LOGI_LCD.color.buttons['cancel']
		|| button === LOGI_LCD.color.buttons['up']
		|| button === LOGI_LCD.color.buttons['down']
		|| button === LOGI_LCD.color.buttons['menu']
	;
}

export function isValidColorBitmapLength(bitmap: number[])
{
	return bitmap.length === BITMAP_LENGTH_COLOR;
}

export function isValidMonoBitmapLength(bitmap: number[])
{
	return bitmap.length === BITMAP_LENGTH_MONO;
}

export function isValidBitmapValues(bitmap: number[])
{
	return bitmap.every((byte) => (byte & 255) === byte);
}
