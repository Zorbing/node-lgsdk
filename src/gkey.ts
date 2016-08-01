import libPath from './path';
import * as ffi from 'ffi';
import * as wchar_t from 'ref-wchar';

var wchar_string = wchar_t.string;

// const LOGITECH_MAX_MOUSE_BUTTONS = 20;
// const LOGITECH_MAX_GKEYS = 29;
// const LOGITECH_MAX_M_STATES = 3;

export interface GkeyCode
{
	// 8 bit; index of the G key or mouse button, for example, 6 for G6 or Button 6
	keyIdx: number;
    // 1 bit; key up or down, 1 is down, 0 is up
	keyDown: number;
    // 2 bit; mState (1, 2 or 3 for M1, M2 and M3)
	mState: number;
    // 1 bit; indicate if the Event comes from a mouse, 1 is yes, 0 is no.
	mouse: number;
    // 4 bit; reserved1
	reserved1: number;
    // 16 bit; reserved2
	reserved2: number;
}

export interface logiGkeyCB
{
	(gkeyCode: GkeyCode, gkeyOrButtonString: string/*wchar_string*/, context: any/*void* */): any/*void* */;
}

export interface logiGkeyCBContext
{
	gkeyCallBack: logiGkeyCB;
	gkeyContext: any/*void* */;
}

var gkeyLib = ffi.Library(libPath('gkey'), {
	// Enable the Gkey SDK by calling this function
	  'LogiGkeyInit': ['bool', ['pointer'/*logiGkeyCBContext* gkeyCBContext*/]]
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

export function init(callback?: logiGkeyCB | logiGkeyCBContext): boolean
{
	if (!callback)
	{
		return gkeyLib.LogiGkeyInitWithoutCallback();
	}
	if (typeof callback === 'function')
	{
		return gkeyLib.LogiGkeyInitWithoutContext(callback);
	}
	if (callback.hasOwnProperty('gkeyCallBack') && callback.hasOwnProperty('gkeyContext'))
	{
		return gkeyLib.LogiGkeyInit(callback);
	}
	return false;
}
export function isMouseButtonPressed(buttonNumber: number): boolean
{
	return gkeyLib.LogiGkeyIsMouseButtonPressed(buttonNumber);
}
export function getMouseButtonString(buttonNumber: number): string
{
	return gkeyLib.LogiGkeyGetMouseButtonString(buttonNumber);
}
export function isKeyboardGkeyPressed(gkeyNumber: number, modeNumber: number): boolean
{
	return gkeyLib.LogiGkeyIsKeyboardGkeyPressed(gkeyNumber, modeNumber);
}
export function getKeyboardGkeyString(gkeyNumber: number, modeNumber: number): string
{
	return gkeyLib.LogiGkeyGetKeyboardGkeyString(gkeyNumber, modeNumber);
}
export function shutdown(): void
{
	return gkeyLib.LogiGkeyShutdown();
}
