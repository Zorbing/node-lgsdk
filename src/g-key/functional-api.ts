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

/**
 * Devices:
 *
 * Keyboards:
 * - G710+:
 *     G-keys: 1 to 6
 *     Number of modes: 3
 * - G510/ G510s:
 *     G-keys: 1 to 18
 *     Number of modes: 3
 * - G110:
 *     G-keys: 1 to 12
 *     Number of modes: 3
 * - G19/G19s:
 *     G-keys: 1 to 12
 *     Number of modes: 3
 * - G103:
 *     G-keys: 1 to 6
 *     Number of modes: 3
 * - G105:
 *     G-keys: 1 to 6
 *     Number of modes: 3
 * - G105 Call Of Duty:
 *     G-keys: 1 to 6
 *     Number of modes: 3
 * - G11:
 *     G-keys: 1 to 18
 *     Number of modes: 3
 * - G13 (The SDK treats this device as a keyboard.):
 *     G-keys: 1 to 29
 *     Number of modes: 3
 * - G15 v1:
 *     G-keys: 1 to 18
 *     Number of modes: 3
 * - G15 v2:
 *     G-keys: 1 to 6
 *     Number of modes: 3
 *
 * Headsets:
 * - G35:
 *     G-keys: 1 to 3
 *     Number of modes: 1
 * - G930:
 *     G-keys: 1 to 3
 *     Number of modes: 1
 *
 * Mice:
 * - G600:
 *     Extra buttons: 6 to 20
 * - G300:
 *     Extra buttons: 6 to 9
 * - G400 / G400s:
 *     Extra buttons: 6 to 8
 * - G700 / G700s:
 *     Extra buttons: up to 13
 * - G9 / G9x / G9x Call of duty:
 *     Extra buttons: 4 to 8
 * - MX518:
 *     Extra buttons: 6 to 8
 * - G402:
 *     Extra buttons: 5
 * - G502 Proteus Core:
 *     Extra buttons: 4 to 8
 * - G602:
 *     Extra buttons: 6 to 10
 */

import { MAX_GKEYS, MAX_M_STATES, MAX_MOUSE_BUTTONS } from './constants';
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


// export the constants
export {
	MAX_GKEYS,
	MAX_M_STATES,
	MAX_MOUSE_BUTTONS,
} from './constants';

function checkButtonNumber(buttonNumber: number)
{
	if (!isButtonNumberValid(buttonNumber))
	{
		throw new Error(errorMsg.buttonNumberInvalid(MAX_MOUSE_BUTTONS));
	}
}

function checkGkeyNumber(gkeyNumber: number)
{
	if (!isGkeyNumberValid(gkeyNumber))
	{
		throw new Error(errorMsg.gkeyNumberInvalid(MAX_GKEYS));
	}
}

function checkModeNumber(modeNumber: number)
{
	if (!isModeNumberValid(modeNumber))
	{
		throw new Error(errorMsg.modeNumberInvalid(MAX_M_STATES));
	}
}


let callbackList: any[] = [];
/**
 * TODO: update this comment since the JavaScript wrapper does not use the `LogiGkeyInit()` function.
 * Creating a callback context from a struct was not possible for me, so I decided to use
 * `LogiGkeyInitWithoutCallback()` and `LogiGkeyInitWithoutContext()` instead.
 *
 * ---
 * Copied from the official documentation without adapting to this particular context:
 *
 * The `init()` function initializes the G-key SDK. It must be called before your application can see G-key/button
 * events.
 *
 * Parameters:
 * - `gkeyCBContext`: context for callback. See sample code above or sample program in Samples folder. This value can
 *     be set to NULL if the game wants to use the polling functions instead of a callback.
 *
 * Return value:
 * If the function succeeds, it returns TRUE. Otherwise FALSE.
 *
 * Remarks:
 * Use this initialization if working with any application that is not built using Unreal Engine or Unity game engine.
 * For these two game engines use appropriates function as follows:
 * - Unreal Engine -> `LogiGkeyInitWithoutCallback()`
 * - Unity -> `LogiGkeyInitWithoutContext()`
 *
 * See the examples in the relative documentation to see how to get those functions to work.
 */
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

/**
 * The `isMouseButtonPressed()` function indicates whether a mouse button is currently being pressed.
 *
 * Parameters:
 * - `buttonNumber`: number of the button to check (for example between 6 and 20 for G600).
 *
 * Return value:
 * `true` if the specified button is currently being pressed, `false` otherwise.
 */
export function isMouseButtonPressed(buttonNumber: number): boolean
{
	checkButtonNumber(buttonNumber);

	return gkeyLib.LogiGkeyIsMouseButtonPressed(buttonNumber);
}

/**
 * The `getMouseButtonString()` function returns a button-specific friendly string.
 *
 * Parameters:
 * - `buttonNumber`: number of the button to check (for example between 6 and 20 for G600).
 *
 * Return value:
 * Friendly string for specified button number. For example "Mouse Btn 8".
 */
export function getMouseButtonString(buttonNumber: number): string
{
	checkButtonNumber(buttonNumber);

	return gkeyLib.LogiGkeyGetMouseButtonString(buttonNumber);
}

/**
 * The `isKeyboardGkeyPressed()` function indicates whether a keyboard G-key is currently being pressed.
 *
 * Parameters:
 * - `gkeyNumber`: number of the G-key to check (for example between 1 and 6 for G710).
 * - `modeNumber`: number of the mode currently selected (1, 2 or 3)
 *
 * Return value:
 * `true` if the specified G-key for the specified Mode is currently being pressed, `false` otherwise.
 */
export function isKeyboardGkeyPressed(gkeyNumber: number, modeNumber: number): boolean
{
	checkGkeyNumber(gkeyNumber);
	checkModeNumber(modeNumber);

	return gkeyLib.LogiGkeyIsKeyboardGkeyPressed(gkeyNumber, modeNumber);
}

/**
 * The `getKeyboardGkeyString()` function returns a G-key-specific friendly string.
 *
 * Parameters:
 * - `gkeyNumber`: number of the G-key to check (for example between 1 and 6 for G710).
 * - `modeNumber`: number of the mode currently selected (1, 2 or 3)
 *
 * Return value:
 * Friendly string for specified G-key and Mode number. For example "G5/M1".
 */
export function getKeyboardGkeyString(gkeyNumber: number, modeNumber: number): string
{
	checkGkeyNumber(gkeyNumber);
	checkModeNumber(modeNumber);

	return gkeyLib.LogiGkeyGetKeyboardGkeyString(gkeyNumber, modeNumber);
}

/**
 * The `shutdown()` function unloads the corresponding DLL and frees up any allocated resources.
 */
export function shutdown(): void
{
	// free all callbacks to be garbage collected
	callbackList = [];
	return gkeyLib.LogiGkeyShutdown();
}
