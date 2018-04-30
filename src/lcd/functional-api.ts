/**
 * @module node-lgsdk/lcd
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
import {
    COLOR_BITMAP_LENGTH,
    COLOR_BLACK,
    COLOR_BUTTON_CANCEL,
    COLOR_BUTTON_DOWN,
    COLOR_BUTTON_LEFT,
    COLOR_BUTTON_MENU,
    COLOR_BUTTON_OK,
    COLOR_BUTTON_RIGHT,
    COLOR_BUTTON_UP,
    COLOR_HEIGHT,
    COLOR_TYPE,
    COLOR_WHITE,
    COLOR_WIDTH,
    MONO_BITMAP_LENGTH,
    MONO_BLACK,
    MONO_BUTTON_0,
    MONO_BUTTON_1,
    MONO_BUTTON_2,
    MONO_BUTTON_3,
    MONO_HEIGHT,
    MONO_TYPE,
    MONO_WHITE,
    MONO_WIDTH,
	MONO_NUMBER_OF_LINES,
	COLOR_NUMBER_OF_LINES,
} from './constants';
import { errorMsg } from './error-messages';
import {
    isButtonValid,
    isButtonValidForColor,
    isButtonValidForMono,
    isValidBitmapValues,
    isValidColorBitmapLength,
    isValidMonoBitmapLength,
    lcdLib,
} from './ffi-lib';


/**
 * The `init()` function makes necessary initializations. You must call this function prior to any other function in
 * the library.
 *
 * @param friendlyName The name of your applet, you can't change it after initialization.
 * @param lcdType Defines the type of your applet lcd target, it can be one of the following:
 *   - {@link MONO_TYPE}
 *   - {@link MONO_TYPE}
 *   - `MONO_TYPE | COLOR_TYPE` (if you want to initialize your applet for both LCD types)
 *
 * @returns
 * If the function succeeds, it returns true. Otherwise false.
 */
export function init(friendlyName: string, lcdType: number)
{
	return lcdLib.LogiLcdInit(friendlyName, lcdType) as boolean;
}

/**
 * The `isButtonPressed()` function checks if the button specified by the parameter is being pressed.
 *
 * Notes:
 * The button will be considered pressed only if your applet is the one currently in the foreground.
 *
 * @param button Defines the button to check on, it can be one of the following:
 *   - {@link MONO_BUTTON_0}
 *   - {@link MONO_BUTTON_1}
 *   - {@link MONO_BUTTON_2}
 *   - {@link MONO_BUTTON_3}
 *   - {@link COLOR_BUTTON_LEFT}
 *   - {@link COLOR_BUTTON_RIGHT}
 *   - {@link COLOR_BUTTON_OK}
 *   - {@link COLOR_BUTTON_CANCEL}
 *   - {@link COLOR_BUTTON_UP}
 *   - {@link COLOR_BUTTON_DOWN}
 *   - {@link COLOR_BUTTON_MENU}
 *
 * @returns
 * If the button specified is being pressed it returns true. Otherwise false.
 */
export function isButtonPressed(button: number)
{
	if (!isButtonValid(button))
	{
		throw new Error(errorMsg.buttonId);
	}
	else
	{
		return lcdLib.LogiLcdIsButtonPressed(button) as boolean;
	}
}

/**
 * The `isConnected()` function checks if a device of the type specified by the parameter is connected.
 *
 * @param lcdType Defines the lcd type to look for, it can be one of the following:
 *   - {@link MONO_TYPE}
 *   - {@link COLOR_TYPE}
 *   - `MONO_TYPE | COLOR_TYPE` (if you want to look for both LCD types)
 *
 * @returns
 * If a device supporting the lcd type specified is found, it returns true. If the device has not been found or the
 * {@link init} function has not been called before, returns false.
 */
export function isConnected(type: number)
{
	return lcdLib.LogiLcdIsConnected(type) as boolean;
}

/**
 * The `setColorBackground()` function sets the specified image as background for the color lcd device connected.
 *
 * Notes:
 * The image size must be 320x240 in order to use this function.
 *
 * @param colorBitmap The array of pixels that define the actual color bitmap
 *
 *   The array of pixels is organized as a rectangular area, 320 bytes wide and 240 bytes high.
 *   Since the color lcd can display the full RGB gamma, 32 bits per pixel (4 bytes) are used.
 *   The size of the colorBitmap array has to be 320x240x4 = 307200 therefore.
 *   To learn how to use GDI drawing functions efficiently with such an arrangement, see the sample code.
 *   The pixels are arranged in the following order:
 *   [see page 10 of "LogitechGamingLCDSDK.pdf" from https://www.logitechg.com/en-us/developers ]
 *
 *   32 bit values are stored in 4 consecutive bytes that represent the RGB color values for that pixel.
 *   These values use the same top left to bottom right raster style transform to the flat character array with the exception that each pixel value is specified using 4 consecutive bytes.
 *   The illustration below shows the data arrangement for these RGB quads.
 *   Each of the bytes in the RGB quad specify the intensity of the given color.
 *   The value ranges from 0 (the darkest color value) to 255 (brightest color value).
 *
 * @returns
 * True if it succeeds, false otherwise.
 */
export function setColorBackground(colorBitmap: number[])
{
	if (!isValidColorBitmapLength(colorBitmap))
	{
		throw new Error(errorMsg.bitmapLength(COLOR_BITMAP_LENGTH));
	}
	else if (!isValidBitmapValues(colorBitmap))
	{
		throw new Error(errorMsg.bitmapRange);
	}
	else
	{
		return lcdLib.LogiLcdColorSetBackground(colorBitmap) as boolean;
	}
}

/**
 * The `setMonoBackground()` function sets the specified image as background for the monochrome lcd device connected.
 *
 * Notes:
 * The image size must be 160x43 in order to use this function. The SDK will turn on the pixel on the screen if the
 * value assigned to that byte is >= 128, it will remain off if the value is < 128.
 *
 * @param monoBitmap The array of pixels that define the actual monochrome bitmap
 *
 *   The array of pixels is organized as a rectangular area, 160 bytes wide and 43 bytes high.
 *   Despite the display being monochrome, 8 bits per pixel are used here for simple manipulation of individual pixels.
 *   To learn how to use GDI drawing functions efficiently with such an arrangement, see the sample code.
 *   The pixels are arranged in the following order:
 *   [see page 9 of "LogitechGamingLCDSDK.pdf" from https://www.logitechg.com/en-us/developers]
 *
 * @returns
 * True if it succeeds, false otherwise.
 */
export function setMonoBackground(monoBitmap: number[])
{
	if (!isValidMonoBitmapLength(monoBitmap))
	{
		throw new Error(errorMsg.bitmapLength(MONO_BITMAP_LENGTH));
	}
	else if (!isValidBitmapValues(monoBitmap))
	{
		throw new Error(errorMsg.bitmapRange);
	}
	else
	{
		return lcdLib.LogiLcdMonoSetBackground(monoBitmap) as boolean;
	}
}

/**
 * The `setColorText()` function sets the specified text in the requested line on the color lcd device connected.
 *
 * @param lineNumber The line on the screen you want the text to appear.
 *   The color lcd display has 8 lines for standard text, so this parameter can be any number from 0 to 7.
 * @param text Defines the text you want to display
 * @param red This lcd can display a full RGB color gamma, you can define the color of your text using this parameters.
 *   Values between 0 and 255 are accepted.
 *   The default value for this parameters is 255, so if you don't specify any color, your text will be white.
 * @param green See parameter `red`.
 * @param blue See parameter `red`.
 *
 * @returns
 * True if it succeeds, false otherwise.
 */
export function setColorText(lineNumber: number, text: string, red = 255, green = 255, blue = 255)
{
	if (!Number.isInteger(lineNumber))
	{
		throw new Error(errorMsg.lineIdNotInteger);
	}
	else if (lineNumber < 0 || lineNumber > COLOR_NUMBER_OF_LINES - 1)
	{
		throw new Error(errorMsg.lineId(lineNumber, COLOR_NUMBER_OF_LINES - 1));
	}
	else if ((red & 255) !== red ||
		(green & 255) !== green ||
		(blue & 255) !== blue)
	{
		throw new Error(errorMsg.colorByte);
	}
	else
	{
		return lcdLib.LogiLcdColorSetText(lineNumber, text, red, green, blue) as boolean;
	}
}

/**
 * The `setMonoText()` function sets the specified text in the requested line on the monochrome lcd device connected.
 *
 * @param lineNumber The line on the screen you want the text to appear.
 *   The monochrome lcd display has 4 lines, so this parameter can be any number from 0 to 3.
 * @param text Defines the text you want to display
 *
 * @returns
 * True if it succeeds, false otherwise.
 */
export function setMonoText(lineNumber: number, text: string)
{
	if (!Number.isInteger(lineNumber))
	{
		throw new Error(errorMsg.lineIdNotInteger);
	}
	else if (lineNumber < 0 || lineNumber > MONO_NUMBER_OF_LINES - 1)
	{
		throw new Error(errorMsg.lineId(lineNumber, MONO_NUMBER_OF_LINES - 1));
	}
	else
	{
		return lcdLib.LogiLcdMonoSetText(lineNumber, text) as boolean;
	}
}

/**
 * The `setColorTitle()` function sets the specified text in the first line on the color lcd device connected. The font
 * size that will be displayed is bigger than the one used in the other lines, so you can use this function to set the
 * title of your applet/page.
 *
 * @param text Defines the text you want to display as title
 * @param red This lcd can display a full RGB color gamma, you can define the color of your title using this parameters.
 *   Values between 0 and 255 are accepted.
 *   The default value for this parameters is 255, so if you don't specify any color, your title will be white.
 * @param green See parameter `red`.
 * @param blue See parameter `red`.
 *
 * @returns
 * True if it succeeds, false otherwise.
 */
export function setColorTitle(text: string, red = 255, green = 255, blue = 255)
{
	if ((red & 255) !== red ||
		(green & 255) !== green ||
		(blue & 255) !== blue)
	{
		throw new Error(errorMsg.colorByte);
	}
	else
	{
		return lcdLib.LogiLcdColorSetTitle(text, red, green, blue) as boolean;
	}
}

/**
 * The `shutdown()` function kills the applet and frees memory used by the SDK.
 */
export function shutdown()
{
	return lcdLib.LogiLcdShutdown() as void;
}

/**
 * The `update()` function updates the lcd display.
 *
 * Notes:
 * You have to call this function every frame of your main loop, to keep the lcd updated.
 */
export function update()
{
	return lcdLib.LogiLcdUpdate() as void;
}

/**
 * @todo
 */
export namespace convert2Grayscale
{
	/**
	 * @todo
	 */
	export function average(red: number, green: number, blue: number, alpha = 255)
	{
		return Math.round((red + green + blue) / 3);
	}

	/**
	 * @todo
	 */
	export function lightness(red: number, green: number, blue: number, alpha = 255)
	{
		return Math.round((Math.max(red, green, blue) + Math.min(red, green, blue)) / 2);
	}

	/**
	 * @todo
	 */
	export function luminosity(red: number, green: number, blue: number, alpha = 255)
	{
		return Math.round(0.21 * red + 0.72 * green + 0.07 * blue);
	}
}

/**
 * @hidden
 */
const generalApi = {
	init,
	isButtonPressed,
	isConnected,
	setColorBackground,
	setMonoBackground,
	setColorText,
	setMonoText,
	setColorTitle,
	shutdown,
	update,
};


/**
 * All constants and functions which are used interacting with monochrome devices.
 *
 * @module node-lgsdk/lcd/mono
 */
export module mono
{
	/**
	 * @see {@link MONO_TYPE}
	 */
	export const TYPE = MONO_TYPE;
	/**
	 * @see {@link MONO_BUTTON_0}
	 */
	export const BUTTON_0 = MONO_BUTTON_0;
	/**
	 * @see {@link MONO_BUTTON_1}
	 */
	export const BUTTON_1 = MONO_BUTTON_1;
	/**
	 * @see {@link MONO_BUTTON_2}
	 */
	export const BUTTON_2 = MONO_BUTTON_2;
	/**
	 * @see {@link MONO_BUTTON_3}
	 */
	export const BUTTON_3 = MONO_BUTTON_3;
	/**
	 * @see {@link MONO_WIDTH}
	 */
	export const WIDTH = MONO_WIDTH;
	/**
	 * @see {@link MONO_HEIGHT}
	 */
	export const HEIGHT = MONO_HEIGHT;
	/**
	 * @see {@link MONO_BITMAP_LENGTH}
	 */
	export const BITMAP_LENGTH = MONO_BITMAP_LENGTH;
	/**
	 * @see {@link MONO_WHITE}
	 */
	export const WHITE = MONO_WHITE[0];
	/**
	 * @see {@link MONO_BLACK}
	 */
	export const BLACK = MONO_BLACK[0];

	/**
	 * Executes {@link node-lgsdk/lcd/init} where the `type` parameter is set to {@link MONO_TYPE}.
	 */
	export function init(friendlyName: string)
	{
		return generalApi.init(friendlyName, TYPE);
	}

	/**
	 * Checks the button number to be valid for monochrome displays and executes {@link node-lgsdk/lcd/isButtonPressed} afterwards.
	 */
	export function isButtonPressed(button: number)
	{
		if (!isButtonValidForMono(button))
		{
			throw new Error(errorMsg.buttonId);
		}
		else
		{
			return generalApi.isButtonPressed(button);
		}
	}

	/**
	 * Executes {@link node-lgsdk/lcd/isConnected} where the `type` parameter is set to {@link MONO_TYPE}.
	 */
	export function isConnected()
	{
		return generalApi.isConnected(TYPE);
	}

	/**
	 * @see {@link setMonoBackground}
	 */
	export function setBackground(monoBitmap: number[])
	{
		return generalApi.setMonoBackground(monoBitmap);
	}

	/**
	 * @see {@link setMonoText}
	 */
	export function setText(lineNumber: number, text: string)
	{
		return generalApi.setMonoText(lineNumber, text);
	}

	/**
	 * Executes {@link node-lgsdk/lcd/shutdown}.
	 */
	export function shutdown()
	{
		return generalApi.shutdown();
	}

	/**
	 * Executes {@link node-lgsdk/lcd/update}.
	 */
	export function update()
	{
		return generalApi.update();
	}
}


/**
 * All constants and functions which are used interacting with color devices.
 *
 * @module node-lgsdk/lcd/color
 */
export module color
{
	/**
	 * @see {@link COLOR_TYPE}
	 */
	export const TYPE = COLOR_TYPE;
	/**
	 * @see {@link COLOR_BUTTON_LEFT}
	 */
	export const BUTTON_LEFT = COLOR_BUTTON_LEFT;
	/**
	 * @see {@link COLOR_BUTTON_RIGHT}
	 */
	export const BUTTON_RIGHT = COLOR_BUTTON_RIGHT;
	/**
	 * @see {@link COLOR_BUTTON_OK}
	 */
	export const BUTTON_OK = COLOR_BUTTON_OK;
	/**
	 * @see {@link COLOR_BUTTON_CANCEL}
	 */
	export const BUTTON_CANCEL = COLOR_BUTTON_CANCEL;
	/**
	 * @see {@link COLOR_BUTTON_UP}
	 */
	export const BUTTON_UP = COLOR_BUTTON_UP;
	/**
	 * @see {@link COLOR_BUTTON_DOWN}
	 */
	export const BUTTON_DOWN = COLOR_BUTTON_DOWN;
	/**
	 * @see {@link COLOR_BUTTON_MENU}
	 */
	export const BUTTON_MENU = COLOR_BUTTON_MENU;
	/**
	 * @see {@link COLOR_WIDTH}
	 */
	export const WIDTH = COLOR_WIDTH;
	/**
	 * @see {@link COLOR_HEIGHT}
	 */
	export const HEIGHT = COLOR_HEIGHT;
	/**
	 * @see {@link COLOR_BITMAP_LENGTH}
	 */
	export const BITMAP_LENGTH = COLOR_BITMAP_LENGTH;
	/**
	 * @see {@link COLOR_WHITE}
	 */
	export const WHITE = COLOR_WHITE;
	/**
	 * @see {@link COLOR_BLACK}
	 */
	export const BLACK = COLOR_BLACK;

	/**
	 * Executes {@link node-lgsdk/lcd/init} where the `type` parameter is set to {@link COLOR_TYPE}.
	 */
	export function init(friendlyName: string)
	{
		return generalApi.init(friendlyName, TYPE);
	}

	/**
	 * Checks the button number to be valid for color displays and executes {@link node-lgsdk/lcd/isButtonPressed} afterwards.
	 */
	export function isButtonPressed(button: number)
	{
		if (!isButtonValidForColor(button))
		{
			throw new Error(errorMsg.buttonId);
		}
		else
		{
			return generalApi.isButtonPressed(button);
		}
	}

	/**
	 * Executes {@link node-lgsdk/lcd/isConnected} where the `type` parameter is set to {@link COLOR_TYPE}.
	 */
	export function isConnected()
	{
		return generalApi.isConnected(TYPE);
	}

	/**
	 * @see {@link setColorBackground}
	 */
	export function setBackground(colorBitmap: number[])
	{
		return generalApi.setColorBackground(colorBitmap);
	}

	/**
	 * @see {@link setColorText}
	 */
	export function setText(lineNumber: number, text: string, red?: number, green?: number, blue?: number)
	{
		return generalApi.setColorText(lineNumber, text, red, green, blue);
	}

	/**
	 * @see {@link setColorTitle}
	 */
	export function setTitle(text: string, red?: number, green?: number, blue?: number)
	{
		return generalApi.setColorTitle(text, red, green, blue);
	}

	/**
	 * Executes {@link node-lgsdk/lcd/shutdown}.
	 */
	export function shutdown()
	{
		return generalApi.shutdown();
	}

	/**
	 * Executes {@link node-lgsdk/lcd/update}.
	 */
	export function update()
	{
		return generalApi.update();
	}
}
