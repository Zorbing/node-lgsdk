import { LOGITECH_MAX_GKEYS, LOGITECH_MAX_M_STATES, LOGITECH_MAX_MOUSE_BUTTONS } from './constants';
import { errorMsg } from './error-messages';
import {
    createInitCallback,
    gkeyLib,
    gkeyNumber,
    isButtonNumberValid,
    isGkeyNumberValid,
    isModeNumberValid,
    logiGkeyCB,
    logiGkeyCBContext,
    modeNumber,
    mouseButtonNumber,
} from './ffi-instance';


function checkButtonNumber(buttonNumber: mouseButtonNumber)
{
	if (!isButtonNumberValid(buttonNumber))
	{
		throw new Error(errorMsg.buttonNumberInvalid(LOGITECH_MAX_MOUSE_BUTTONS));
	}
}

function checkGkeyNumber(gkeyNumber: gkeyNumber)
{
	if (!isGkeyNumberValid(gkeyNumber))
	{
		throw new Error(errorMsg.gkeyNumberInvalid(LOGITECH_MAX_GKEYS));
	}
}

function checkModeNumber(modeNumber: modeNumber)
{
	if (!isModeNumberValid(modeNumber))
	{
		throw new Error(errorMsg.modeNumberInvalid(LOGITECH_MAX_M_STATES));
	}
}


const callbackList: any[] = [];
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

export function isMouseButtonPressed(buttonNumber: mouseButtonNumber): boolean
{
	checkButtonNumber(buttonNumber);

	return gkeyLib.LogiGkeyIsMouseButtonPressed(buttonNumber);
}

export function getMouseButtonString(buttonNumber: mouseButtonNumber): string
{
	checkButtonNumber(buttonNumber);

	return gkeyLib.LogiGkeyGetMouseButtonString(buttonNumber);
}

export function isKeyboardGkeyPressed(gkeyNumber: gkeyNumber, modeNumber: modeNumber): boolean
{
	checkGkeyNumber(gkeyNumber);
	checkModeNumber(modeNumber);

	return gkeyLib.LogiGkeyIsKeyboardGkeyPressed(gkeyNumber, modeNumber);
}

export function getKeyboardGkeyString(gkeyNumber: gkeyNumber, modeNumber: modeNumber): string
{
	checkGkeyNumber(gkeyNumber);
	checkModeNumber(modeNumber);

	return gkeyLib.LogiGkeyGetKeyboardGkeyString(gkeyNumber, modeNumber);
}

export function shutdown(): void
{
	return gkeyLib.LogiGkeyShutdown();
}
