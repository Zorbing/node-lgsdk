import { LOGITECH_MAX_GKEYS, LOGITECH_MAX_M_STATES, LOGITECH_MAX_MOUSE_BUTTONS } from './constants';
import { errorMsg } from './error-messages';
import {
    createInitCallback,
    gkeyLib,
    isButtonNumberValid,
    isGkeyNumberValid,
    isModeNumberValid,
    logiGkeyCB,
    logiGkeyCBContext,
} from './ffi-lib';


function checkButtonNumber(buttonNumber: number)
{
	if (!isButtonNumberValid(buttonNumber))
	{
		throw new Error(errorMsg.buttonNumberInvalid(LOGITECH_MAX_MOUSE_BUTTONS));
	}
}

function checkGkeyNumber(gkeyNumber: number)
{
	if (!isGkeyNumberValid(gkeyNumber))
	{
		throw new Error(errorMsg.gkeyNumberInvalid(LOGITECH_MAX_GKEYS));
	}
}

function checkModeNumber(modeNumber: number)
{
	if (!isModeNumberValid(modeNumber))
	{
		throw new Error(errorMsg.modeNumberInvalid(LOGITECH_MAX_M_STATES));
	}
}


let callbackList: any[] = [];
export function init(callback?: logiGkeyCB | logiGkeyCBContext): boolean
{
	if (!callback)
	{
		return gkeyLib.LogiGkeyInitWithoutCallback();
	}
	if (typeof callback === 'function')
	{
		const ffiCallback = createInitCallback(callback);
		callbackList.push(ffiCallback);
		return gkeyLib.LogiGkeyInitWithoutContext(ffiCallback);
	}
	if (callback.hasOwnProperty('gkeyCallBack') && callback.hasOwnProperty('gkeyContext'))
	{
		return init(callback.gkeyCallBack.bind(callback.gkeyContext));
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
	// free all callbacks to be garbage collected
	callbackList = [];
	return gkeyLib.LogiGkeyShutdown();
}
