import * as ref from 'ref';
import * as wchar_t from 'ref-wchar';

import { KeyName as KeyNameEnum } from './constants';
import { errorMsg } from './error-messages';
import { isBitmapValid, ledLib } from './ffi-lib';


const wchar_string = wchar_t.string;


/**
 * Devices:
 * - G910 Orion Spark:
 *     Single key RGB support.
 *     This keyboard supports all the functions available in the SDK, both per-key lighting and full keyboard lighting.
 * - G810 Orion Spectrum:
 *     Single key RGB support.
 *     This keyboard supports all the functions available in the SDK, both per-key lighting and full keyboard lighting.
 * - G610 Orion Brown:
 *     Single key Monochrome support.
 *     This device accepts all the functions for devices of type `LOGI_DEVICETYPE_PERKEY_RGB`. It will only display the
 *     highest value for R,G,B on each key.
 * - G710+:
 *     Single color only. Full resolution. Highest value for R, G or B defines brightness.
 * - G633 & G933:
 *     Supports full RGB.
 * - G600:
 *     Supports full RGB, will work with the SDK only if set to Host mode through Logitech Gaming Software.
 * - G510 / G510s:
 *     Supports full RGB.
 * - G110:
 *     Supports full R(ed) and B(lue), but not G(reen).
 *     When calling the SDK’s LogiLedSetLighting function, values for green will be ignored.
 * - G19 / G19s:
 *     Supports full RGB.
 * - G105:
 *     Single color only. Full resolution. Highest value for R, G or B defines brightness.
 * - G105 Call Of Duty:
 *     Single color only. Full resolution. Highest value for R, G or B defines brightness.
 * - G300:
 *     Supports red on/off, green on/off, blue on/off, or a combination of the three. When calling the SDK's
 *     `setLighting()` function, if the percentage given is below 50, the color will be off, and when above 50, the
 *     color will be on.
 * - G900 Chaos Spectrum:
 *     Supports Full RGB.
 * - G303 Daedalus Apex:
 *     Supports Full RGB.
 * - G11:
 *     Single color only, 3 levels of brightness. When calling the SDK’s LogiLedSetLighting function, if the highest
 *     RGB percentage given is below 33, the color will be off, if between 33 and 66, the brightness will be low, and
 *     when above 66, the brightness will be high.
 * - G13 (The SDK treats this device as a keyboard.):
 *     Supports full RGB.
 * - G15 v1:
 *     Single color only, 3 levels of brightness. When calling the SDK’s LogiLedSetLighting function, if the highest
 *     RGB percentage given is below 33, the color will be off, if between 33 and 66, the brightness will be low, and
 *     when above 66, the brightness will be high.
 * - G15 v2:
 *     Single color only, 3 levels of brightness. When calling the SDK’s LogiLedSetLighting function, if the highest
 *     RGB percentage given is below 33, the color will be off, if between 33 and 66, the brightness will be low, and
 *     when above 66, the brightness will be high.
 */


/**
 * Enum of keys:
 *	- ESC:                0x01
 *	- F1:                 0x3b
 *	- F2:                 0x3c
 *	- F3:                 0x3d
 *	- F4:                 0x3e
 *	- F5:                 0x3f
 *	- F6:                 0x40
 *	- F7:                 0x41
 *	- F8:                 0x42
 *	- F9:                 0x43
 *	- F10:                0x44
 *	- F11:                0x57
 *	- F12:                0x58
 *	- PRINT_SCREEN:       0x137
 *	- SCROLL_LOCK:        0x46
 *	- PAUSE_BREAK:        0x45
 *	- TILDE:              0x29
 *	- ONE:                0x02
 *	- TWO:                0x03
 *	- THREE:              0x04
 *	- FOUR:               0x05
 *	- FIVE:               0x06
 *	- SIX:                0x07
 *	- SEVEN:              0x08
 *	- EIGHT:              0x09
 *	- NINE:               0x0A
 *	- ZERO:               0x0B
 *	- MINUS:              0x0C
 *	- EQUALS:             0x0D
 *	- BACKSPACE:          0x0E
 *	- INSERT:             0x152
 *	- HOME:               0x147
 *	- PAGE_UP:            0x149
 *	- NUM_LOCK:           0x145
 *	- NUM_SLASH:          0x135
 *	- NUM_ASTERISK:       0x37
 *	- NUM_MINUS:          0x4A
 *	- TAB:                0x0F
 *	- Q:                  0x10
 *	- W:                  0x11
 *	- E:                  0x12
 *	- R:                  0x13
 *	- T:                  0x14
 *	- Y:                  0x15
 *	- U:                  0x16
 *	- I:                  0x17
 *	- O:                  0x18
 *	- P:                  0x19
 *	- OPEN_BRACKET:       0x1A
 *	- CLOSE_BRACKET:      0x1B
 *	- BACKSLASH:          0x2B
 *	- KEYBOARD_DELETE:    0x153
 *	- END:                0x14F
 *	- PAGE_DOWN:          0x151
 *	- NUM_SEVEN:          0x47
 *	- NUM_EIGHT:          0x48
 *	- NUM_NINE:           0x49
 *	- NUM_PLUS:           0x4E
 *	- CAPS_LOCK:          0x3A
 *	- A:                  0x1E
 *	- S:                  0x1F
 *	- D:                  0x20
 *	- F:                  0x21
 *	- G:                  0x22
 *	- H:                  0x23
 *	- J:                  0x24
 *	- K:                  0x25
 *	- L:                  0x26
 *	- SEMICOLON:          0x27
 *	- APOSTROPHE:         0x28
 *	- ENTER:              0x1C
 *	- NUM_FOUR:           0x4B
 *	- NUM_FIVE:           0x4C
 *	- NUM_SIX:            0x4D
 *	- LEFT_SHIFT:         0x2A
 *	- Z:                  0x2C
 *	- X:                  0x2D
 *	- C:                  0x2E
 *	- V:                  0x2F
 *	- B:                  0x30
 *	- N:                  0x31
 *	- M:                  0x32
 *	- COMMA:              0x33
 *	- PERIOD: 	          0x34
 *	- FORWARD_SLASH:      0x35
 *	- RIGHT_SHIFT:        0x36
 *	- ARROW_UP:           0x148
 *	- NUM_ONE:            0x4F
 *	- NUM_TWO:            0x50
 *	- NUM_THREE:          0x51
 *	- NUM_ENTER:          0x11C
 *	- LEFT_CONTROL:       0x1D
 *	- LEFT_WINDOWS:       0x15B
 *	- LEFT_ALT:           0x38
 *	- SPACE:              0x39
 *	- RIGHT_ALT:          0x138
 *	- RIGHT_WINDOWS:      0x15C
 *	- APPLICATION_SELECT: 0x15D
 *	- RIGHT_CONTROL:      0x11D
 *	- ARROW_LEFT:         0x14B
 *	- ARROW_DOWN:         0x150
 *	- ARROW_RIGHT:        0x14D
 *	- NUM_ZERO:           0x52
 *	- NUM_PERIOD:         0x53
 *	- G_1:                0xFFF1
 *	- G_2:                0xFFF2
 *	- G_3:                0xFFF3
 *	- G_4:                0xFFF4
 *	- G_5:                0xFFF5
 *	- G_6:                0xFFF6
 *	- G_7:                0xFFF7
 *	- G_8:                0xFFF8
 *	- G_9:                0xFFF9
 *	- G_LOGO:             0xFFFF1
 *	- G_BADGE:            0xFFFF2
 */
export const KeyName = KeyNameEnum;

/**
 * The `init()` function makes sure there isn’t already another instance running and then makes necessary
 * initializations. It saves the current lighting for all connected and supported devices.
 * This function will also stop any effect currently going on the connected devices.
 *
 * Return value:
 * If the function succeeds, it returns true. Otherwise false.
 * If it returns false, means that the connection with Logitech Gaming Software is broken, make sure that it is running.
 */
export function init()
{
	return ledLib.LogiLedInit() as boolean;
}

/**
 * The `getSdkVersion()` function retrieves the version of the SDK version installed on the user's system.
 *
 * Parameters:
 * - `majorNum`: [in] the function will fill this parameter with the major build number of the sdk installed in the
 *     system
 * - `minorNum`: [in] the function will fill this parameter with the minor build number of the sdk installed in the
 *   system
 * - `buildNum`: [in] the function will fill this parameter with the build number of the sdk installed in the system
 *
 * Return value:
 * If the function succeeds, it returns true. Otherwise false.
 * If it returns false, means that there is no SDK installed on the user system, or the sdk version could not be
 * retrieved.
 */
export function getSdkVersion()
{
	const majorNum = ref.alloc('int');
	const minorNum = ref.alloc('int');
	const buildNum = ref.alloc('int');
	if (ledLib.LogiLedGetSdkVersion(majorNum, minorNum, buildNum))
	{
		return {
			major: majorNum.deref<number>(),
			minor: minorNum.deref<number>(),
			build: buildNum.deref<number>(),
			toString: function ()
			{
				return `${this.major}.${this.minor}.${this.build}`;
			}
		};
	}
	else
	{
		return null;
	}
}

/**
 * The `getConfigOption*()` function set, allows the developer to query for an option set by the user and use that
 * value to customize the interaction with the SDK. A call to any of these functions will create an entry in the
 * Logitech Gaming Software – Applet Manager View. This view is disabled by default, since it’s something targeting
 * only "Advanced users", to enable it click on the Settings Icon in LGS and then check the box "Show Game integration
 * customization view"
 *
 * Parameters:
 * - `configPath`: This identifies the option uniquely. This can be just a string (e.g., "Terrorist") or it can be a
 *     two level tree ("Colors/Terrorist"). If the two level tree is specified, the option will be displayed in Logitech
 *     Gaming Software as an entry ("Terrorist") inside a group ("Colors").
 * - `defaultValue`: This parameter, depending on the specific function takes the default value for the relative
 *     option. If the option has been modified through LGS by the user, it will be filled in with the modified value,
 *     otherwise the default value will be saved (to be shown to the user) and it won't be modified.
 *
 * Return value:
 * The function always returns true, unless some bad parameter has been specified.
 *
 * Usage Example:
 * ```js
 * const healthFlashingThreshold = lgsdk.led.getConfigOptionNumber("player/flashing_edge", 0.15);
 * //This healthFlashingThreshold value will now contain the option as set by the user, or the default value if it has never been set.
 *
 * //This function is just to display a prettier name in the LGS customization interface.
 * lgsdk.led.setConfigOptionLabel("player/flashing_edge", "Flash Health Percentage");
 * if (player.health() < healthFlashingThreshold)
 * {
 *   lgsdk.led.flashLighting(100, 0, 0, 0, 100);
 * }
 * ```
 */
export function getConfigOptionNumber(configPath: string, defaultValue?: number)
{
	const defaultValuePointer = ref.alloc('double', defaultValue);
	if (ledLib.LogiLedGetConfigOptionNumber(configPath, defaultValuePointer))
	{
		return defaultValuePointer.deref<number>();
	}
	else
	{
		return null;
	}
}

/**
 * @see getConfigOptionNumber
 */
export function getConfigOptionBool(configPath: string, defaultValue?: boolean)
{
	const defaultValuePointer = ref.alloc('bool', defaultValue);
	if (ledLib.LogiLedGetConfigOptionBool(configPath, defaultValuePointer))
	{
		return defaultValuePointer.deref<boolean>();
	}
	else
	{
		return null;
	}
}

/**
 * @see getConfigOptionNumber
 */
export function getConfigOptionColor(configPath: string, defaultRed?: number, defaultGreen?: number, defaultBlue?: number)
{
	const defaultRedPointer = ref.alloc('int', defaultRed);
	const defaultGreenPointer = ref.alloc('int', defaultGreen);
	const defaultBluePointer = ref.alloc('int', defaultBlue);
	if (ledLib.LogiLedGetConfigOptionColor(configPath, defaultRedPointer, defaultGreenPointer, defaultBluePointer))
	{
		return {
			red: defaultRedPointer.deref<number>(),
			green: defaultGreenPointer.deref<number>(),
			blue: defaultBluePointer.deref<number>(),
		};
	}
	else
	{
		return null;
	}
}

/**
 * TODO: is bufferSize really optional and what does it stand for?
 * Probably the `bufferSize` is used for the `defaultValue` parameter, since it is an array in C/C++ and therefore has
 * a maximum size for content copied to it.
 *
 * @see getConfigOptionNumber
 */
export function getConfigOptionKeyInput(configPath: string, defaultValue?: string, bufferSize?: number)
{
	const defaultValuePointer = ref.alloc(wchar_string, defaultValue);
	if (ledLib.LogiLedGetConfigOptionKeyInput(configPath, defaultValuePointer, bufferSize))
	{
		return defaultValuePointer.deref<string>();
	}
	else
	{
		return null;
	}
}

/**
 * TODO: docs
 */
export function setConfigOptionLabel(configPath: string, label?: string)
{
	const labelPointer = ref.alloc(wchar_string, label);
	if (ledLib.LogiLedSetConfigOptionLabel(configPath, labelPointer))
	{
		return labelPointer.deref<string>();
	}
	else
	{
		return null;
	}
}

/**
 * The `setTargetDevice()` function sets the target device type for future calls. The default target device is
 * `LOGI_DEVICETYPE_ALL`, therefore, if no call is made to LogiLedSetTargetDevice the SDK will apply any function to
 * all the connected devices.
 *
 * Parameters:
 * - `targetDevice`: one or a combination of the following values:
 *     `LOGI_DEVICETYPE_MONOCHROME`
 *     `LOGI_DEVICETYPE_RGB`
 *     `LOGI_DEVICETYPE_PERKEY_RGB`
 *     `LOGI_DEVICETYPE_ALL`
 *
 * Return value:
 * If the function succeeds, it returns true. Otherwise false.
 * The function will return false if `init()` hasn't been called, the parameter is wrong, or if the connection with
 * Logitech Gaming Software was lost.
 *
 * Example:
 * ```js
 * lgsdk.led.init();
 * lgsdk.led.setTargetDevice(LOGI_DEVICETYPE_RGB | LOGI_DEVICETYPE_MONOCHROME);
 * //From now on the calls to LED SDK will only affect RGB and MONOCHROME devices, PER_KEY devices such as G910 will ignore this calls
 * lgsdk.led.setLighting(100, 0, 0);
 * …
 * lgsdk.led.setTargetDevice(LOGI_DEVICETYPE_PERKEY_RGB);
 * //Future calls will only affect per-key rgb devices such as G910.
 * lgsdk.led.setLightingForKeyWithKeyName(keyboardNames::ARROW_DOWN, 100, 0, 0);
 * lgsdk.led.flashLighting(50, 50, 50, 0, 300);
 * …
 * lgsdk.led.setTargetDevice(LOGI_DEVICETYPE_ALL);
 * //From now on we’ll affect all the connected devices
 * lgsdk.led.setLighting(50, 0, 0);
 * …
 * lgsdk.led.shutDown();
 * ```
 * @param targetDevice
 */
export function setTargetDevice(targetDevice: number)
{
	return ledLib.LogiLedSetTargetDevice(targetDevice) as boolean;
}

/**
 * The `saveCurrentLighting()` function saves the current lighting so that it can be restored after a temporary
 * effect is finished. For example if flashing a red warning sign for a few seconds, you would call the
 * `saveCurrentLighting()` function just before starting the warning effect.
 * On per-key backlighting supporting devices, this function will save the current state for each key.
 *
 * Return value:
 * If the function succeeds, it returns true. Otherwise false.
 * The function will return false if `init()` hasn't been called or if the connection with Logitech Gaming Software was
 * lost.
 */
export function saveCurrentLighting()
{
	return ledLib.LogiLedSaveCurrentLighting() as boolean;
}

/**
 * The `setLighting()` function sets the lighting on connected and supported devices.
 *
 * Parameters:
 * - `redPercentage`: amount of red. Range is 0 to 100.
 * - `greenPercentage`: amount of green. Range is 0 to 100.
 * - `bluePercentage`: amount of blue. Range is 0 to 100.
 *
 * Return value:
 * If the function succeeds, it returns true. Otherwise false.
 * The function will return false if `init()` hasn't been called or if the connection with Logitech Gaming Software was
 * lost.
 *
 * Remarks:
 * Do not call this function immediately after `init()`. Instead leave a little bit of time after `init()`.
 * For devices that only support a single color, the highest percentage value given of the three colors will define the
 * intensity. For monochrome backlighting device, Logitech Gaming Software will reduce proportionally the value of the
 * highest color, according to the user hardware brightness setting.
 */
export function setLighting(redPercentage: number, greenPercentage: number, bluePercentage: number)
{
	return ledLib.LogiLedSetLighting(redPercentage, greenPercentage, bluePercentage) as boolean;
}

/**
 * The `restoreLighting()` function restores the last saved lighting. It should be called after a temporary effect is
 * finished. For example if flashing a red warning sign for a few seconds, you would call this function right after the
 * warning effect is finished.
 * On per-key backlighting supporting devices, this function will restore the saved state for each key.
 *
 * Return value:
 * If the function succeeds, it returns true. Otherwise false.
 * The function will return false if `init()` hasn't been called or if the connection with Logitech Gaming Software was
 * lost.
 */
export function restoreLighting()
{
	return ledLib.LogiLedRestoreLighting() as boolean;
}

/**
 * The `flashLighting()` function saves the current lighting, plays the flashing effect on the targeted devices and,
 * finally, restores the saved lighting.
 *
 * Parameters:
 * - `redPercentage`: amount of red. Range is 0 to 100.
 * - `greenPercentage`: amount of green. Range is 0 to 100.
 * - `bluePercentage`: amount of blue. Range is 0 to 100.
 * - `msDuration`: duration of the effect in milliseconds, this parameter can be set to
 *     `LOGI_LED_DURATION_INFINITE` to make the effect run until stopped through `stopEffects()`
 * - `msInterval`: duration of the flashing interval in milliseconds
 *
 * Return value:
 * If the function succeeds, it returns true. Otherwise false.
 * The function will return false if `init()` hasn't been called, if the connection with Logitech Gaming Software was
 * lost or if another effect is currently running.
 */
export function flashLighting(
	redPercentage: number,
	greenPercentage: number,
	bluePercentage: number,
	msDuration: number,
	msInterval: number
)
{
	return ledLib.LogiLedFlashLighting(
		redPercentage,
		greenPercentage,
		bluePercentage,
		msDuration,
		msInterval
	) as boolean;
}

/**
 * The `pulseLighting()` function saves the current lighting, plays the pulsing effect on the targeted devices and,
 * finally, restores the saved lighting.
 *
 * Parameters:
 * - `redPercentage`: amount of red. Range is 0 to 100.
 * - `greenPercentage`: amount of green. Range is 0 to 100.
 * - `bluePercentage`: amount of blue. Range is 0 to 100.
 * - `msDuration`: duration of the effect in milliseconds, this parameter can be set to
 *     `LOGI_LED_DURATION_INFINITE` to make the effect run until stopped through `stopEffects()`
 * - `msInterval`: duration of the flashing interval in milliseconds
 *
 * Return value:
 * If the function succeeds, it returns true. Otherwise false.
 * The function will return false if `init()` hasn't been called, if the connection with Logitech Gaming Software was
 * lost or if another effect is currently running.
 */
export function pulseLighting(
	redPercentage: number,
	greenPercentage: number,
	bluePercentage: number,
	msDuration: number,
	msInterval: number
)
{
	return ledLib.LogiLedPulseLighting(
		redPercentage,
		greenPercentage,
		bluePercentage,
		msDuration,
		msInterval
	) as boolean;
}

/**
 * The `stopEffects()` function stops any of the presets effects (started from `flashLighting()` or `pulseLighting()`).
 *
 * Return value:
 * If the function succeeds, it returns true. Otherwise false.
 * The function will return false if `init()` hasn't been called or if the connection with Logitech Gaming Software was
 * lost.
 */
export function stopEffects()
{
	return ledLib.LogiLedStopEffects() as boolean;
}

/**
 * The `setLightingFromBitmap()` function, sets the array of bytes passed as parameter as colors to per-key
 * backlighting featured connected devices.
 *
 * Parameters:
 * - `bitmap`: an unsigned char array containing the colors to assign to each key on the per-lighting device connected.
 *     The size required for this bitmap is defined by `LOGI_LED_BITMAP_SIZE`
 *
 * The array of pixels is organized as a rectangular area, 21x6, representing the keys on the device. Each color is
 * represented by four consecutive bytes (RGBA).
 * Here is a graphical representation of the bitmap array:
 * [see page 22 of "LogitechGamingLEDSDK.pdf" from https://www.logitechg.com/en-us/developers]
 *
 * 32 bit values are stored in 4 consecutive bytes that represent the RGB color values for that pixel.
 * These values use the same top left to bottom right raster style transform to the flat character array with the
 * exception that each pixel value is specified using 4 consecutive bytes. The illustration below shows the data
 * arrangement for these RGB quads.
 * [see page 22 of "LogitechGamingLEDSDK.pdf" from https://www.logitechg.com/en-us/developers]
 *
 * Each of the bytes in the RGB quad specify the intensity of the given color. The value ranges from 0 (the darkest
 * color value) to 255 (brightest color value).
 *
 * Return value:
 * If the function succeeds, it returns true. Otherwise false.
 * The function will return false if `init()` hasn't been called or if the connection with Logitech Gaming Software was
 * lost.
 *
 * Remarks:
 * The array passed in has to be allocated by the caller of the size LOGI_LED_BITMAP_SIZE. If the array is smaller, the
 * function will apply the effect to a smaller portion of the keyboard and set everything else to black. If the array
 * is bigger, the remaining part will be ignored. To create partial bitmaps and update only parts of the keyboard, set
 * the alpha channel for the keys to ignore to 0. This will allow to update just portion of the keyboard, without
 * overriding the other keys.
 */
export function setLightingFromBitmap(bitmap: number[])
{
	if (!isBitmapValid(bitmap))
	{
		throw new Error(errorMsg.bitmapInvalid);
	}
	else
	{
		return ledLib.LogiLedSetLightingFromBitmap(bitmap) as boolean;
	}
}

/**
 * The `setLightingForKeyWithScanCode()` function sets the key identified by the scancode passed as parameter to the
 * desired color. This function only affects per-key backlighting featured connected devices.
 *
 * Parameters:
 * - `keyCode`: the scan-code of the key to set
 * - `redPercentage`: amount of red. Range is 0 to 100.
 * - `greenPercentage`: amount of green. Range is 0 to 100.
 * - `bluePercentage`: amount of blue. Range is 0 to 100.
 *
 * Return value:
 * If the function succeeds, it returns true. Otherwise false.
 * The function will return false if `init()` hasn't been called or if the connection with Logitech Gaming Software was
 * lost.
 */
export function setLightingForKeyWithScanCode(
	keyCode: number,
	redPercentage: number,
	greenPercentage: number,
	bluePercentage: number
)
{
	return ledLib.LogiLedSetLightingForKeyWithScanCode(
		keyCode,
		redPercentage,
		greenPercentage,
		bluePercentage
	) as boolean;
}

/**
 * The `setLightingForKeyWithHidCode()` function sets the key identified by the hid code passed as parameter to the
 * desired color. This function only affects per-key backlighting featured connected devices.
 *
 * Parameters:
 * - `keyCode`: the hid-code of the key to set
 * - `redPercentage`: amount of red. Range is 0 to 100.
 * - `greenPercentage`: amount of green. Range is 0 to 100.
 * - `bluePercentage`: amount of blue. Range is 0 to 100.
 *
 * Return value:
 * If the function succeeds, it returns true. Otherwise false.
 * The function will return false if `init()` hasn't been called or if the connection with Logitech Gaming Software was
 * lost.
 */
export function setLightingForKeyWithHidCode(
	keyCode: number,
	redPercentage: number,
	greenPercentage: number,
	bluePercentage: number
)
{
	return ledLib.LogiLedSetLightingForKeyWithHidCode(
		keyCode,
		redPercentage,
		greenPercentage,
		bluePercentage
	) as boolean;
}

/**
 * The `setLightingForKeyWithQuartzCode()` function sets the key identified by the quartz code passed as parameter to
 * the desired color. This function only affects per-key backlighting featured connected devices.
 *
 * Parameters:
 * - `keyCode`: the quartz-code of the key to set
 * - `redPercentage`: amount of red. Range is 0 to 100.
 * - `greenPercentage`: amount of green. Range is 0 to 100.
 * - `bluePercentage`: amount of blue. Range is 0 to 100.
 *
 * Return value:
 * If the function succeeds, it returns true. Otherwise false.
 * The function will return false if `init()` hasn't been called or if the connection with Logitech Gaming Software was
 * lost.
 */
export function setLightingForKeyWithQuartzCode(
	keyCode: number,
	redPercentage: number,
	greenPercentage: number,
	bluePercentage: number
)
{
	return ledLib.LogiLedSetLightingForKeyWithQuartzCode(
		keyCode,
		redPercentage,
		greenPercentage,
		bluePercentage
	) as boolean;
}

/**
 * The `setLightingForKeyWithKeyName()` function sets the key identified by the code passed as parameter to the desired
 * color. This function only affects per-key backlighting featured connected devices.
 *
 * Parameters:
 * - `keyCode`: one of the key codes from the enum `KeyName`
 * - `redPercentage`: amount of red. Range is 0 to 100.
 * - `greenPercentage`: amount of green. Range is 0 to 100.
 * - `bluePercentage`: amount of blue. Range is 0 to 100.
 *
 * Return value:
 * If the function succeeds, it returns true. Otherwise false.
 * The function will return false if `init()` hasn't been called or if the connection with Logitech Gaming Software was
 * lost.
 */
export function setLightingForKeyWithKeyName(
	keyName: KeyNameEnum,
	redPercentage: number,
	greenPercentage: number,
	bluePercentage: number
)
{
	return ledLib.LogiLedSetLightingForKeyWithKeyName(
		keyName,
		redPercentage,
		greenPercentage,
		bluePercentage
	) as boolean;
}

/**
 * The `saveLightingForKey()` function saves the current color on the keycode passed as argument. Use this function
 * with the `restoreLightingForKey()` to preserve the state of a key before applying any effect.
 * This function only applies to device of the family `LOGI_DEVICETYPE_PERKEY_RGB`.
 *
 * Parameters:
 * - `keyName`: The key to save the color for. A value from the `KeyName` enum.
 *
 * Return value:
 * If the function succeeds, it returns true. Otherwise false.
 * The function will return false if `init()` hasn't been called or if the connection with Logitech Gaming Software was
 * lost.
 */
export function saveLightingForKey(keyName: KeyNameEnum)
{
	return ledLib.LogiLedSaveLightingForKey(keyName) as boolean;
}

/**
 * The `restoreLightingForKey()` function restores the saved color on the keycode passed as argument. Use this function
 * with the LogiLedSaveLightingForKey to preserve the state of a key before applying any effect.
 * This function only applies to device of the family `LOGI_DEVICETYPE_PERKEY_RGB`.
 *
 * Parameters:
 * - `keyName`: The key to restore the color on. A value from the `KeyName` enum.
 *
 * Return value:
 * If the function succeeds, it returns true. Otherwise false.
 * The function will return false if `init()` hasn't been called or if the connection with Logitech Gaming Software was
 * lost.
 */
export function restoreLightingForKey(keyName: KeyNameEnum)
{
	return ledLib.LogiLedRestoreLightingForKey() as boolean;
}

/**
 * The `excludeKeysFromBitmap()` function sets a list of keys, defined by keynames to be ignored when calling the
 * function `setLightingFromBitmap()`. This is useful when creating effects on the bitmap during gameplay loop, but
 * still wanting to set some keys on top of that using the LogiLedSetLightingFromKeyName.
 *
 * Parameters:
 * - `keyList`: A preallocated array of `KeyName(s)` to be excluded when calling `setLightingFromBitmap()`
 *
 * Return value:
 * ?
 */
export function excludeKeysFromBitmap(keyList: KeyNameEnum[])
{
	return ledLib.LogiLedExcludeKeysFromBitmap(keyList, keyList.length) as boolean;
}

/**
 * The `flashSingleKey()` function starts a flashing effect on the key passed as parameter. The key will be flashing
 * with an interval as defined by `msInterval` for `msDuration` milliseconds, alternating the color passed in as
 * parameter and black. This function only applies to device of the family `LOGI_DEVICETYPE_PERKEY_RGB`.
 *
 * Parameters:
 * - `keyName`: The key to restore the color on. A value from the `KeyName` enum.
 * - `redPercentage`: amount of red in the active color of the flash effect. Range is 0 to 100.
 * - `greenPercentage`: amount of green in the active color of the flash effect. Range is 0 to 100.
 * - `bluePercentage`: amount of blue in the active color of the flash effect. Range is 0 to 100.
 * - `msDuration`: duration in milliseconds of the effect on the single key. This parameter can be set to
 *     `LOGI_LED_DURATION_INFINITE` to make the effect run until stopped through `stopEffects()` or
 *     `stopEffectsOnKey()`
 * - `msInterval`: duration of the flashing interval in milliseconds
 *
 * Return value:
 * If the function succeeds, it returns true. Otherwise false.
 * The function will return false if `init()` hasn't been called or if the connection with Logitech Gaming Software was
 * lost.
 */
export function flashSingleKey(
	keyName: KeyNameEnum,
	redPercentage: number,
	greenPercentage: number,
	bluePercentage: number,
	msDuration: number,
	msInterval: number
)
{
	return ledLib.LogiLedFlashSingleKey(
		keyName,
		redPercentage,
		greenPercentage,
		bluePercentage,
		msDuration,
		msInterval
	) as boolean;
}

/**
 * The `pulseSingleKey()` function starts a pulsing effect on the key passed as parameter. The key will be pulsing with
 * from start color to finish color for msDuration milliseconds. This function only applies to device of the family
 * `LOGI_DEVICETYPE_PERKEY_RGB`.
 *
 * Parameters:
 * - `keyName`: The key to restore the color on. A value from the LogiLed::KeyName enum.
 * - `startRedPercentage`: amount of red in the start color of the pulse effect. Range is 0 to 100.
 * - `startGreenPercentage`: amount of green in the start color of the pulse effect. Range is 0 to 100.
 * - `startBluePercentage`: amount of blue in the start color of the pulse effect. Range is 0 to 100.
 * - `finishRedPercentage`: amount of red in the finish color of the pulse effect. Range is 0 to 100.
 * - `finishGreenPercentage`: amount of green in the finish color of the pulse effect. Range is 0 to 100.
 * - `finishBluePercentage`: amount of blue in the finish color of the pulse effect. Range is 0 to 100.
 * - `msDuration`: duration in milliseconds of the effect on the single key.
 * - `isInfinite`: if this is set to true the effect will loop infinitely until stopped with a called to
 *     `stopEffects()` or `stopEffectsOnKey()`
 *
 * Return value:
 * If the function succeeds, it returns true. Otherwise false.
 * The function will return false if `init()` hasn't been called or if the connection with Logitech Gaming Software was
 * lost.
 */
export function pulseSingleKey(
	keyName: KeyNameEnum,
	startRedPercentage: number,
	startGreenPercentage: number,
	startBluePercentage: number,
	finishRedPercentage: number,
	finishGreenPercentage: number,
	finishBluePercentage: number,
	msDuration: number,
	isInfinite: boolean
)
{
	return ledLib.LogiLedPulseSingleKey(
		keyName,
		startRedPercentage,
		startGreenPercentage,
		startBluePercentage,
		finishRedPercentage,
		finishGreenPercentage,
		finishBluePercentage,
		msDuration,
		isInfinite
	) as boolean;
}

/**
 * The `stopEffectsOnKey()` function stops any ongoing effect on the key passed in as parameter. This function only
 * applies to device of the family `LOGI_DEVICETYPE_PERKEY_RGB`.
 *
 * Parameters:
 * - `keyName`: The key to stop the effects on. A value from the `KeyName` enum.
 *
 * Return value:
 * If the function succeeds, it returns true. Otherwise false.
 * The function will return false if `init()` hasn't been called or if the connection with Logitech Gaming Software was
 * lost.
 */
export function stopEffectsOnKey(keyName: KeyNameEnum)
{
	return ledLib.LogiLedStopEffectsOnKey(keyName) as boolean;
}

/**
 * The `shutdown()` function restores the last saved lighting and frees memory used by the SDK.
 */
export function shutdown()
{
	return ledLib.LogiLedShutdown() as void;
}
