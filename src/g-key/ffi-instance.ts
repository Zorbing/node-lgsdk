import * as ffi from 'ffi';
import * as ref from 'ref';
import * as Struct from 'ref-struct';
import * as wchar_t from 'ref-wchar';

import { libPath } from '../path';
import { LOGITECH_MAX_GKEYS, LOGITECH_MAX_M_STATES, LOGITECH_MAX_MOUSE_BUTTONS } from './constants';


const wchar_string = wchar_t.string;

export type mouseButtonNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
export type gkeyNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29;
export type modeNumber = 1 | 2 | 3;

export interface GkeyCode
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
export const GkeyCode = Struct({
	'keyIdx': 'int'
	, 'keyDown': 'int'
	, 'mState': 'int'
	, 'mouse': 'int'
	, 'reserved1': 'int'
	, 'reserved2': 'int'
});
export const GkeyCodePtr = ref.refType(GkeyCode);

export interface logiGkeyCB
{
	(gkeyCode: GkeyCode, gkeyOrButtonString: string/*wchar_string*/, context: any/*void* */): any/*void* */;
}

export interface logiGkeyCBContext
{
	gkeyCallBack: logiGkeyCB;
	gkeyContext: any/*void* */;
}
export const CBContext = Struct({
	'gkeyCallBack': 'pointer'//logiGkeyCB
	, 'gkeyContext': 'pointer'//void*
});
export const CBContextPtr = ref.refType(CBContext);


export const gkeyLib = ffi.Library(libPath('gkey'), {
	// Enable the Gkey SDK by calling this function
	  'LogiGkeyInit': ['bool', [CBContextPtr/*logiGkeyCBContext* gkeyCBContext*/]]
	// Enable the Gkey SDK by calling this function if not using callback. Use this initialization if using Unreal Engine
	, 'LogiGkeyInitWithoutCallback': ['bool', []]
	// Enable the Gkey SDK be calling this function if not using context. Use this initialization if working with Unity Engine
	, 'LogiGkeyInitWithoutContext': ['bool', ['pointer'/*logiGkeyCB gkeyCallBack*/]]
	// Check if a mouse button is currently pressed
	, 'LogiGkeyIsMouseButtonPressed': ['bool', ['int'/*const int buttonNumber*/]]
	// Get friendly name for mouse button
	, 'LogiGkeyGetMouseButtonString': [wchar_string, ['int'/*const int buttonNumber*/]]
	// Check if a keyboard G-key is currently pressed
	, 'LogiGkeyIsKeyboardGkeyPressed': ['bool', ['int'/*const int gkeyNumber*/, 'int'/*const  int modeNumber*/]]
	// Get friendly name for G-key
	, 'LogiGkeyGetKeyboardGkeyString': [wchar_string, ['int'/*const int gkeyNumber*/, 'int'/*const  int modeNumber*/]]
	// Disable the Gkey SDK, free up all the resources.
	, 'LogiGkeyShutdown': ['void', []]
});


export function isButtonNumberValid(buttonNumber: mouseButtonNumber)
{
	return Number.isInteger(buttonNumber) && buttonNumber >= 0 && buttonNumber <= LOGITECH_MAX_MOUSE_BUTTONS;
}

export function isGkeyNumberValid(gkeyNumber: gkeyNumber)
{
	return Number.isInteger(gkeyNumber) && gkeyNumber >= 0 && gkeyNumber <= LOGITECH_MAX_GKEYS;
}

export function isModeNumberValid(modeNumber: modeNumber)
{
	return Number.isInteger(modeNumber) && modeNumber >= 1 && modeNumber <= LOGITECH_MAX_M_STATES;
}

export function createInitCallback(callback: Function)
{
	return ffi.Callback(
		ref.types.void
		, [ref.refType(ref.types.void)/*GkeyCodePtr*/, wchar_string, ref.refType(ref.types.void)]
		, callback
	);
}
