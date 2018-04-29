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

import { BITMAP_LENGTH_COLOR, BITMAP_LENGTH_MONO, LOGI_LCD } from './constants';
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
 * Parameters:
 * - `friendlyName`: the name of your applet, you can't change it after initialization.
 * - `lcdType`: defines the type of your applet lcd target, it can be one of the following:
 *     + `LOGI_LCD_TYPE_MONO`
 *     + `LOGI_LCD_TYPE_COLOR`
 *     + If you want to initialize your applet for both LCD types just use
 *       `LOGI_LCD_TYPE_MONO | LOGI_LCD_TYPE_COLOR`
 *
 * Return value:
 * If the function succeeds, it returns true. Otherwise false.
 */
export function init(friendlyName: string, lcdType: number)
{
	return lcdLib.LogiLcdInit(friendlyName, lcdType) as boolean;
}

/**
 * The `isButtonPressed()` function checks if the button specified by the parameter is being pressed.
 *
 * Parameters:
 * - `button`: defines the button to check on, it can be one of the following:
 *     + `LOGI_LCD_MONO_BUTTON_0`
 *     + `LOGI_LCD_MONO_BUTTON_1`
 *     + `LOGI_LCD_MONO_BUTTON_2`
 *     + `LOGI_LCD_MONO_BUTTON_3`
 *     + `LOGI_LCD_COLOR_BUTTON_LEFT`
 *     + `LOGI_LCD_COLOR_BUTTON_RIGHT`
 *     + `LOGI_LCD_COLOR_BUTTON_OK`
 *     + `LOGI_LCD_COLOR_BUTTON_CANCEL`
 *     + `LOGI_LCD_COLOR_BUTTON_UP`
 *     + `LOGI_LCD_COLOR_BUTTON_DOWN`
 *     + `LOGI_LCD_COLOR_BUTTON_MENU`
 *
 * Return value:
 * If the button specified is being pressed it returns true. Otherwise false.
 *
 * Notes:
 * The button will be considered pressed only if your applet is the one currently in the foreground.
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
 * Parameters:
 * - `lcdType`: defines the lcd type to look for, it can be one of the following:
 *     + `LOGI_LCD_TYPE_MONO`
 *     + `LOGI_LCD_TYPE_COLOR`
 *     + If you want to look for both LCD types just use
 *       `LOGI_LCD_TYPE_MONO | LOGI_LCD_TYPE_COLOR`
 *
 * Return value:
 * If a device supporting the lcd type specified is found, it returns true. If the device has not been found or the
 * `init()` function has not been called before, returns false.
 */
export function isConnected(type: number)
{
	return lcdLib.LogiLcdIsConnected(type) as boolean;
}

/**
 * The `setColorBackground()` function sets the specified image as background for the color lcd device connected.
 *
 * Parameters:
 * - `colorBitmap`: the array of pixels that define the actual color bitmap
 *     The array of pixels is organized as a rectangular area, 320 bytes wide and 240 bytes high. Since the color lcd
 *     can display the full RGB gamma, 32 bits per pixel (4 bytes) are used. The size of the colorBitmap array has to
 *     be 320x240x4 = 307200 therefore. To learn how to use GDI drawing functions efficiently with such an arrangement,
 *     see the sample code.
 *     The pixels are arranged in the following order:
 *     [see page 10 of "LogitechGamingLCDSDK.pdf" from https://www.logitechg.com/en-us/developers]
 *
 *     32 bit values are stored in 4 consecutive bytes that represent the RGB color values for that pixel.
 *     These values use the same top left to bottom right raster style transform to the flat character array with the
 *     exception that each pixel value is specified using 4 consecutive bytes. The illustration below shows the data
 *     arrangement for these RGB quads.
 *     Each of the bytes in the RGB quad specify the intensity of the given color. The value ranges from 0 (the darkest
 *     color value) to 255 (brightest color value)
 *
 * Return value:
 * True if it succeeds, false otherwise.
 *
 * Notes:
 * The image size must be 320x240 in order to use this function.
 */
export function setColorBackground(colorBitmap: number[])
{
	if (!isValidColorBitmapLength(colorBitmap))
	{
		throw new Error(errorMsg.bitmapLength(BITMAP_LENGTH_COLOR));
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
 * Parameters:
 * - `monoBitmap`: the array of pixels that define the actual monochrome bitmap
 *     The array of pixels is organized as a rectangular area, 160 bytes wide and 43 bytes high. Despite the display
 *     being monochrome, 8 bits per pixel are used here for simple manipulation of individual pixels. To learn how to
 *     use GDI drawing functions efficiently with such an arrangement, see the sample code.
 *     The pixels are arranged in the following order
 *     [see page 9 of "LogitechGamingLCDSDK.pdf" from https://www.logitechg.com/en-us/developers]
 *
 * Return value:
 * True if it succeeds, false otherwise.
 *
 * Notes:
 * The image size must be 160x43 in order to use this function. The SDK will turn on the pixel on the screen if the
 * value assigned to that byte is >= 128, it will remain off if the value is < 128.
 */
export function setMonoBackground(monoBitmap: number[])
{
	if (!isValidMonoBitmapLength(monoBitmap))
	{
		throw new Error(errorMsg.bitmapLength(BITMAP_LENGTH_MONO));
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
 * Parameters:
 * - `lineNumber`: the line on the screen you want the text to appear. The color lcd display has 8 lines for standard
 *     text, so this parameter can be any number from 0 to 7.
 * - `text`: defines the text you want to display
 * - `red`, `green`, `blue`: this lcd can display a full RGB color gamma, you can define the color of your text using
 *     this parameters. Values between 0 and 255 are accepted. The default value for this parameters is 255, so if you
 *     don’t specify any color, your text will be white.
 *
 * Return value:
 * True if it succeeds, false otherwise.
 */
export function setColorText(lineNumber: number, text: string, red = 255, green = 255, blue = 255)
{
	if (!Number.isInteger(lineNumber))
	{
		throw new Error(errorMsg.lineIdNotInteger);
	}
	else if (lineNumber < 0 || lineNumber > 7)
	{
		throw new Error(errorMsg.lineId(lineNumber, 7));
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
 * Parameters:
 * - `lineNumber`: the line on the screen you want the text to appear. The monochrome lcd display has 4 lines, so this
 *     parameter can be any number from 0 to 3.
 * - `text`: defines the text you want to display
 *
 * Return value:
 * True if it succeeds, false otherwise.
 */
export function setMonoText(lineNumber: number, text: string)
{
	if (!Number.isInteger(lineNumber))
	{
		throw new Error(errorMsg.lineIdNotInteger);
	}
	else if (lineNumber < 0 || lineNumber > 3)
	{
		throw new Error(errorMsg.lineId(lineNumber, 4));
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
 * Parameters:
 * - `text`: defines the text you want to display as title
 * - `red`, `green`, `blue`: this lcd can display a full RGB color gamma, you can define the color of your title using
 *     this parameters. Values between 0 and 255 are accepted. The default value for this parameters is 255, so if you
 *     don’t specify any color, your title will be white.
 *
 * Return value:
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
	return lcdLib.LogiLcdShutdown();
}

/**
 * The `update()` function updates the lcd display.
 *
 * Notes:
 * You have to call this function every frame of your main loop, to keep the lcd updated.
 */
export function update()
{
	return lcdLib.LogiLcdUpdate();
}

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


export module mono
{
	export const TYPE = LOGI_LCD.mono.type;
	export const BUTTON_0 = LOGI_LCD.mono.buttons['0'];
	export const BUTTON_1 = LOGI_LCD.mono.buttons['1'];
	export const BUTTON_2 = LOGI_LCD.mono.buttons['2'];
	export const BUTTON_3 = LOGI_LCD.mono.buttons['3'];
	export const WIDTH = LOGI_LCD.mono.width;
	export const HEIGHT = LOGI_LCD.mono.height;
	export const BITMAP_LENGTH = BITMAP_LENGTH_MONO;
	export const WHITE = 0;
	export const BLACK = 255;

	/**
	 * @see init
	 */
	export function init(friendlyName: string)
	{
		return generalApi.init(friendlyName, TYPE);
	}

	/**
	 * @see isButtonPressed
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
	 * @see isConnected
	 */
	export function isConnected()
	{
		return generalApi.isConnected(TYPE);
	}

	/**
	 * @see setMonoBackground
	 */
	export function setBackground(monoBitmap: number[])
	{
		return generalApi.setMonoBackground(monoBitmap);
	}

	/**
	 * @see setMonoText
	 */
	export function setText(lineNumber: number, text: string)
	{
		return generalApi.setMonoText(lineNumber, text);
	}

	/**
	 * @see shutdown
	 */
	export function shutdown()
	{
		return generalApi.shutdown();
	}

	/**
	 * @see update
	 */
	export function update()
	{
		return generalApi.update();
	}
}


export module color
{
	export const TYPE = LOGI_LCD.color.type;
	export const BUTTON_LEFT = LOGI_LCD.color.buttons['left'];
	export const BUTTON_RIGHT = LOGI_LCD.color.buttons['right'];
	export const BUTTON_OK = LOGI_LCD.color.buttons['ok'];
	export const BUTTON_CANCEL = LOGI_LCD.color.buttons['cancel'];
	export const BUTTON_UP = LOGI_LCD.color.buttons['up'];
	export const BUTTON_DOWN = LOGI_LCD.color.buttons['down'];
	export const BUTTON_MENU = LOGI_LCD.color.buttons['menu'];
	export const WIDTH = LOGI_LCD.color.width;
	export const HEIGHT = LOGI_LCD.color.height;
	export const BITMAP_LENGTH = BITMAP_LENGTH_COLOR;

	/**
	 * @see init
	 */
	export function init(friendlyName: string)
	{
		return generalApi.init(friendlyName, TYPE);
	}

	/**
	 * @see isButtonPressed
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
	 * @see isConnected
	 */
	export function isConnected()
	{
		return generalApi.isConnected(TYPE);
	}

	/**
	 * @see setColorBackground
	 */
	export function setBackground(colorBitmap: number[])
	{
		return generalApi.setColorBackground(colorBitmap);
	}

	/**
	 * @see setColorText
	 */
	export function setText(lineNumber: number, text: string, red?: number, green?: number, blue?: number)
	{
		return generalApi.setColorText(lineNumber, text, red, green, blue);
	}

	/**
	 * @see setColorTitle
	 */
	export function setTitle(text: string, red?: number, green?: number, blue?: number)
	{
		return generalApi.setColorTitle(text, red, green, blue);
	}

	/**
	 * @see shutdown
	 */
	export function shutdown()
	{
		return generalApi.shutdown();
	}

	/**
	 * @see update
	 */
	export function update()
	{
		return generalApi.update();
	}
}
