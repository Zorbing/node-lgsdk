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
export function init(callback?: logiGkeyCB | logiGkeyCBContext)
{
	if (!callback)
	{
		return gkeyLib.LogiGkeyInitWithoutCallback() as boolean;
	}
	else if (typeof callback === 'function')
	{
		const ffiCallback = createInitCallback(callback);
		callbackList.push(ffiCallback);
		return gkeyLib.LogiGkeyInitWithoutContext(ffiCallback) as boolean;
	}
	else if (callback.hasOwnProperty('gkeyCallBack') && callback.hasOwnProperty('gkeyContext'))
	{
		return init(callback.gkeyCallBack.bind(callback.gkeyContext)) as any;
	}
	else
	{
		return false;
	}
}

export function isMouseButtonPressed(buttonNumber: number)
{
	checkButtonNumber(buttonNumber);

	return gkeyLib.LogiGkeyIsMouseButtonPressed(buttonNumber) as boolean;
}

export function getMouseButtonString(buttonNumber: number): string
{
	checkButtonNumber(buttonNumber);

	return gkeyLib.LogiGkeyGetMouseButtonString(buttonNumber);
}

export function isKeyboardGkeyPressed(gkeyNumber: number, modeNumber: number)
{
	checkGkeyNumber(gkeyNumber);
	checkModeNumber(modeNumber);

	return gkeyLib.LogiGkeyIsKeyboardGkeyPressed(gkeyNumber, modeNumber) as boolean;
}

export function getKeyboardGkeyString(gkeyNumber: number, modeNumber: number)
{
	checkGkeyNumber(gkeyNumber);
	checkModeNumber(modeNumber);

	return gkeyLib.LogiGkeyGetKeyboardGkeyString(gkeyNumber, modeNumber) as string;
}

export function shutdown()
{
	// free all callbacks to be garbage collected
	callbackList = [];
	return gkeyLib.LogiGkeyShutdown() as void;
}
