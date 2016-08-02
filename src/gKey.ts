import libPath from './path';
import * as ffi from 'ffi';
import * as ref from 'ref';
import * as wchar_t from 'ref-wchar';
import * as Struct from 'ref-struct';

let wchar_string = wchar_t.string;

const LOGITECH_MAX_MOUSE_BUTTONS = 20;
const LOGITECH_MAX_GKEYS = 29;
const LOGITECH_MAX_M_STATES = 3;

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
let GkeyCode = Struct({
	'keyIdx': 'int'
	, 'keyDown': 'int'
	, 'mState': 'int'
	, 'mouse': 'int'
	, 'reserved1': 'int'
	, 'reserved2': 'int'
});
let GkeyCodePtr = ref.refType(GkeyCode);

export interface logiGkeyCB
{
	(gkeyCode: GkeyCode, gkeyOrButtonString: string/*wchar_string*/, context: any/*void* */): any/*void* */;
}

export interface logiGkeyCBContext
{
	gkeyCallBack: logiGkeyCB;
	gkeyContext: any/*void* */;
}
let CBContext = Struct({
	'gkeyCallBack': 'pointer'//logiGkeyCB
	, 'gkeyContext': 'pointer'//void*
});
let CBContextPtr = ref.refType(CBContext);

let gkeyLib = ffi.Library(libPath('gkey'), {
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

function checkButtonNumber(buttonNumber: number)
{
	if (buttonNumber < 0 || buttonNumber > LOGITECH_MAX_MOUSE_BUTTONS)
	{
		throw new Error('Mouse button number out of range (allowed values: 0-' + LOGITECH_MAX_MOUSE_BUTTONS + ')');
	}
}
function checkGkeyNumber(gkeyNumber: number)
{
	if (gkeyNumber < 0 || gkeyNumber > LOGITECH_MAX_GKEYS)
	{
		throw new Error('G-Key number out of range (allowed values: 0-' + LOGITECH_MAX_GKEYS + ')');
	}
}
function checkModeNumber(modeNumber: number)
{
	if (modeNumber < 0 || modeNumber > LOGITECH_MAX_M_STATES)
	{
		throw new Error('Mode number out of range (allowed values: 0-' + LOGITECH_MAX_M_STATES + ')');
	}
}
function createInitCallback(callback: Function)
{
	return ffi.Callback(
		ref.refType(ref.types.void)
		, [GkeyCodePtr, wchar_string, ref.refType(ref.types.void)]
		, callback
	);
}


export function init(callback?: logiGkeyCB | logiGkeyCBContext): boolean
{
	// TODO: test wrapping callback with ffi.Callback
	if (!callback)
	{
		return gkeyLib.LogiGkeyInitWithoutCallback();
	}
	if (typeof callback === 'function')
	{
		return gkeyLib.LogiGkeyInitWithoutContext(createInitCallback(callback));
	}
	if (callback.hasOwnProperty('gkeyCallBack') && callback.hasOwnProperty('gkeyContext'))
	{
		let context = new CBContext();
		context.gkeyCallBack = createInitCallback(callback.gkeyCallBack);
		context.gkeyContext = callback.gkeyContext;
		return gkeyLib.LogiGkeyInit(context);
	}
	return false;
}
export function isMouseButtonPressed(buttonNumber: number): boolean
{
	checkButtonNumber(buttonNumber);
	
	return gkeyLib.LogiGkeyIsMouseButtonPressed(buttonNumber);
}
export function getMouseButtonString(buttonNumber: number): string
{
	checkButtonNumber(buttonNumber);
	
	return gkeyLib.LogiGkeyGetMouseButtonString(buttonNumber);
}
export function isKeyboardGkeyPressed(gkeyNumber: number, modeNumber: number): boolean
{
	checkGkeyNumber(gkeyNumber);
	checkModeNumber(modeNumber);
	
	return gkeyLib.LogiGkeyIsKeyboardGkeyPressed(gkeyNumber, modeNumber);
}
export function getKeyboardGkeyString(gkeyNumber: number, modeNumber: number): string
{
	checkGkeyNumber(gkeyNumber);
	checkModeNumber(modeNumber);
	
	return gkeyLib.LogiGkeyGetKeyboardGkeyString(gkeyNumber, modeNumber);
}
export function shutdown(): void
{
	return gkeyLib.LogiGkeyShutdown();
}
