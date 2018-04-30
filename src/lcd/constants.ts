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

/**
 * Monochrome displays (resolution 160x43):
 *	- G510 / G510s
 *	- G13
 *	- G15v1
 *	- G15v2
 *
 * Color displays (resoultion 320x240, full RGBA):
 *	- G19 / G19s
 */

/**
 * @see {@link LcdConfig.type}
 *
 * @private
 */
export const COLOR_TYPE = 0x00000002;

/**
 * @see {@link LcdConfig.type}
 *
 * @private
 */
export const MONO_TYPE = 0x00000001;

/**
 * @private
 */
export const COLOR_BUTTON_LEFT = 0x00000100;

/**
 * @private
 */
export const COLOR_BUTTON_RIGHT = 0x00000200;

/**
 * @private
 */
export const COLOR_BUTTON_OK = 0x00000400;

/**
 * @private
 */
export const COLOR_BUTTON_CANCEL = 0x00000800;

/**
 * @private
 */
export const COLOR_BUTTON_UP = 0x00001000;

/**
 * @private
 */
export const COLOR_BUTTON_DOWN = 0x00002000;

/**
 * @private
 */
export const COLOR_BUTTON_MENU = 0x00004000;

/**
 * @private
 */
export const MONO_BUTTON_0 = 0x00000001;

/**
 * @private
 */
export const MONO_BUTTON_1 = 0x00000002;

/**
 * @private
 */
export const MONO_BUTTON_2 = 0x00000004;

/**
 * @private
 */
export const MONO_BUTTON_3 = 0x00000008;

/**
 * @see {@link LcdConfig.width}
 *
 * @private
 */
export const COLOR_WIDTH = 320;

/**
 * @see {@link LcdConfig.width}
 *
 * @private
 */
export const MONO_WIDTH = 160;

/**
 * @see {@link LcdConfig.height}
 *
 * @private
 */
export const COLOR_HEIGHT = 240;

/**
 * @see {@link LcdConfig.height}
 *
 * @private
 */
export const MONO_HEIGHT = 43;

/**
 * @see {@link LcdConfig.numberOfLines}
 *
 * @private
 */
export const COLOR_NUMBER_OF_LINES = 8;

/**
 * @see {@link LcdConfig.numberOfLines}
 *
 * @private
 */
export const MONO_NUMBER_OF_LINES = 4;

/**
 * @see {@link LcdConfig.bytesPerPixel}
 *
 * @private
 */
export const COLOR_BYTES_PER_PIXEL = 4;

/**
 * @see {@link LcdConfig.bytesPerPixel}
 *
 * @private
 */
export const MONO_BYTES_PER_PIXEL = 1;

/**
 * The color value of white (blue, green, red, alpha) for color bitmaps.
 *
 * @private
 */
export const COLOR_WHITE = [255, 255, 255, 255];

/**
 * The color value for white for monochrome bitmaps.
 *
 * @private
 */
export const MONO_WHITE = [255];

/**
 * The color value of black (blue, green, red, alpha) for color bitmaps.
 *
 * @private
 */
export const COLOR_BLACK = [0, 0, 0, 255];

/**
 * The color value for black for monochrome bitmaps.
 *
 * @private
 */
export const MONO_BLACK = [0];

/**
 * The length of a bitmap for a lcd device supporting the colors blue, green and red.
 *
 * @private
 */
export const COLOR_BITMAP_LENGTH = COLOR_WIDTH * COLOR_HEIGHT * COLOR_BYTES_PER_PIXEL;

/**
 * The length of a bitmap for a lcd device supporting only monochrome colors.
 *
 * @private
 */
export const MONO_BITMAP_LENGTH = MONO_WIDTH * MONO_HEIGHT * MONO_BYTES_PER_PIXEL;


/**
 * The configuration for either color or monochrome devices.
 *
 * @private
 */
export interface LcdConfig
{
	/**
	 * A map containing the button codes of the device.
	 */
	buttons: Record<string, number>;
	/**
	 * Number of bits per pixel.
	 * 4 bits for the color device (blue, green, red, and alpha) and 1  bit for monochrome devices.
	 */
	bytesPerPixel: number;
	/**
	 * The height of the lcd.
	 */
	height: number;
	/**
	 * The number of text lines that can be displayed in the device's lcd.
	 */
	numberOfLines: number;
	/**
	 * The device's type code.
	 * It is used in {@link init} and {@link isConnected}.
	 */
	type: number;
	/**
	 * The width of the lcd.
	 */
	width: number;
}

/**
 * Configuration for devices which support colors.
 *
 * @private
 */
export const COLOR_CONFIG = Object.freeze({
	/**
	 * @see {@link LcdConfig.type}
	 */
	type:			COLOR_TYPE,
	/**
	 * @see {@link LcdConfig.buttons}
	 */
	buttons: {
		'left':		COLOR_BUTTON_LEFT,
		'right':	COLOR_BUTTON_RIGHT,
		'ok':		COLOR_BUTTON_OK,
		'cancel':	COLOR_BUTTON_CANCEL,
		'up':		COLOR_BUTTON_UP,
		'down':		COLOR_BUTTON_DOWN,
		'menu':		COLOR_BUTTON_MENU,
	},
	/**
	 * @see {@link LcdConfig.width}
	 */
	width:			COLOR_WIDTH,
	/**
	 * @see {@link LcdConfig.height}
	 */
	height:			COLOR_HEIGHT,
	/**
	 * @see {@link LcdConfig.numberOfLines}
	 */
	numberOfLines:	COLOR_NUMBER_OF_LINES,
	/**
	 * @see {@link LcdConfig.bytesPerPixel}
	 */
	bytesPerPixel:	COLOR_BYTES_PER_PIXEL,
});

/**
 * Configuration for devices which does not support colors.
 *
 * @private
 */
export const MONO_CONFIG = Object.freeze({
	/**
	 * @see {@link LcdConfig.type}
	 */
	type:			MONO_TYPE,
	/**
	 * @see {@link LcdConfig.buttons}
	 */
	buttons: {
		'0':		MONO_BUTTON_0,
		'1':		MONO_BUTTON_1,
		'2':		MONO_BUTTON_2,
		'3':		MONO_BUTTON_3,
	},
	/**
	 * @see {@link LcdConfig.width}
	 */
	width:			MONO_WIDTH,
	/**
	 * @see {@link LcdConfig.height}
	 */
	height:			MONO_HEIGHT,
	/**
	 * @see {@link LcdConfig.numberOfLines}
	 */
	numberOfLines:	MONO_NUMBER_OF_LINES,
	/**
	 * @see {@link LcdConfig.bytesPerPixel}
	 */
	bytesPerPixel:	MONO_BYTES_PER_PIXEL,
});
