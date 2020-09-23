/**
 * @module node-lgsdk/g-key
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
import * as Struct from 'ref-struct';
import * as wchar_t from 'ref-wchar';

import { libPath } from '../path';
import { MAX_GKEYS, MAX_M_STATES, MAX_MOUSE_BUTTONS } from './constants';


/**
 * @hidden
 */
const wchar_string = wchar_t.string;


export type mouseButtonNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
export type gkeyNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29;
export type modeNumber = 1 | 2 | 3;

export interface GkeyCodeData
{
	// 8 bit; index of the G key or mouse button, for example, 6 for G6 or Button 6
	keyIdx: number;
    // 1 bit; key up or down, 1 is down, 0 is up
	keyDown: 0 | 1;
    // 2 bit; mState (1, 2 or 3 for M1, M2 and M3)
	mState: modeNumber;
    // 1 bit; indicate if the Event comes from a mouse, 1 is yes, 0 is no.
	mouse: 0 | 1;
    // 4 bit; reserved1
	reserved1: number;
    // 16 bit; reserved2
	reserved2: number;
}

export const GkeyCodeBitfield = new Struct({
	'bitfield': 'uint32',
});
export const GkeyCode = function (arg, data)
{
	const result = (GkeyCodeBitfield as any).call(this, arg, data);
	const buffer = this['ref.buffer'];
	this['keyIdx']		= (buffer[0] >>> 0);
	this['keyDown']		= (buffer[1] >>> 0) & 0b0001;
	this['mState']		= (buffer[1] >>> 1) & 0b0011;
	this['mouse']		= (buffer[1] >>> 3) & 0b0001;
	this['reserved1']	= (buffer[1] >>> 4) & 0b1111;
	this['reserved2']	= (buffer[2] <<  8) | buffer[3];
	return result;
};
GkeyCode.prototype = GkeyCodeBitfield.prototype;
Object.keys(GkeyCodeBitfield).forEach(key => GkeyCode[key] = GkeyCodeBitfield[key]);

export interface logiGkeyCB
{
	(gkeyCode: GkeyCodeData, gkeyOrButtonString: string/*wchar_string*/, context: any/*void* */): any/*void* */;
}

export interface logiGkeyCBContext
{
	gkeyCallBack: logiGkeyCB;
	gkeyContext: any/*void* */;
}
export const CBContext = Struct({
	'gkeyCallBack': ffi.Function('void *', [GkeyCode, wchar_string, 'void *'])/*logiGkeyCB*/, // 'pointer',
	'gkeyContext': 'void *',
});
export const CBContextPtr = ref.refType(CBContext);

/**
 * The `node-ffi` instance which is linked to the g-key library file.
 */
export const gkeyLib = ffi.Library(libPath('gkey'), {
	// Enable the Gkey SDK by calling this function
	'LogiGkeyInit': ['bool', [CBContextPtr/*logiGkeyCBContext* gkeyCBContext*/]],
	// Enable the Gkey SDK by calling this function if not using callback. Use this initialization if using Unreal Engine
	'LogiGkeyInitWithoutCallback': ['bool', []],
	// Enable the Gkey SDK be calling this function if not using context. Use this initialization if working with Unity Engine
	'LogiGkeyInitWithoutContext': ['bool', ['pointer'/*logiGkeyCB gkeyCallBack*/]],
	// Check if a mouse button is currently pressed
	'LogiGkeyIsMouseButtonPressed': ['bool', ['int'/*const int buttonNumber*/]],
	// Get friendly name for mouse button
	'LogiGkeyGetMouseButtonString': [wchar_string, ['int'/*const int buttonNumber*/]],
	// Check if a keyboard G-key is currently pressed
	'LogiGkeyIsKeyboardGkeyPressed': ['bool', ['int'/*const int gkeyNumber*/, 'int'/*const int modeNumber*/]],
	// Get friendly name for G-key
	'LogiGkeyGetKeyboardGkeyString': [wchar_string, ['int'/*const int gkeyNumber*/, 'int'/*const int modeNumber*/]],
	// Disable the Gkey SDK, free up all the resources.
	'LogiGkeyShutdown': ['void', []],
});

/**
 * Checks if the given number is a valid button number for a mouse.
 *
 * @param buttonNumber The number to check.
 */
export function isButtonNumberValid(buttonNumber: mouseButtonNumber | number): buttonNumber is mouseButtonNumber
{
	return Number.isInteger(buttonNumber) && buttonNumber >= 0 && buttonNumber <= MAX_MOUSE_BUTTONS;
}

/**
 * Checks if the given number is a valid button number for a g-key.
 *
 * @param gkeyNumber The number to check.
 */
export function isGkeyNumberValid(gkeyNumber: gkeyNumber | number): gkeyNumber is gkeyNumber
{
	return Number.isInteger(gkeyNumber) && gkeyNumber >= 0 && gkeyNumber <= MAX_GKEYS;
}

/**
 * Checks if the given number is a valid mode number (M1, M2, ...).
 *
 * @param modeNumber The number to check.
 */
export function isModeNumberValid(modeNumber: modeNumber | number): modeNumber is modeNumber
{
	return Number.isInteger(modeNumber) && modeNumber >= 1 && modeNumber <= MAX_M_STATES;
}

/**
 * Creates an ffi callback for initializing the g-key api.
 *
 * @param callback The callback function.
 */
export function createInitCallback(callback: logiGkeyCB)
{
	return ffi.Callback(
		ref.types.void
		, [GkeyCode, wchar_string, 'void *']
		, callback
	);
}
