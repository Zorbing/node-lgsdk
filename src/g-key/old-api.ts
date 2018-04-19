import { BUTTON_NUMBER_INVALID, GKEY_NUMBER_INVALID, MODE_NUMBER_INVALID } from './error-messages';
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
		throw new Error(BUTTON_NUMBER_INVALID);
	}
}

function checkGkeyNumber(gkeyNumber: gkeyNumber)
{
	if (!isGkeyNumberValid(gkeyNumber))
	{
		throw new Error(GKEY_NUMBER_INVALID);
	}
}

function checkModeNumber(modeNumber: modeNumber)
{
	if (!isModeNumberValid(modeNumber))
	{
		throw new Error(MODE_NUMBER_INVALID);
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
