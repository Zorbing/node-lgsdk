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
 * Monochrome displays (resolution 160x43):
 *	- G510 / G510s
 *	- G13
 *	- G15v1
 *	- G15v2
 *
 * Color displays (resoultion 320x240, full RGBA):
 *	- G19 / G19s
 */

export const COLOR_TYPE = 0x00000002;

export const MONO_TYPE = 0x00000001;

export const COLOR_BUTTON_LEFT = 0x00000100;
export const COLOR_BUTTON_RIGHT = 0x00000200;
export const COLOR_BUTTON_OK = 0x00000400;
export const COLOR_BUTTON_CANCEL = 0x00000800;
export const COLOR_BUTTON_UP = 0x00001000;
export const COLOR_BUTTON_DOWN = 0x00002000;
export const COLOR_BUTTON_MENU = 0x00004000;

export const MONO_BUTTON_0 = 0x00000001;
export const MONO_BUTTON_1 = 0x00000002;
export const MONO_BUTTON_2 = 0x00000004;
export const MONO_BUTTON_3 = 0x00000008;

export const COLOR_WIDTH = 320;

export const MONO_WIDTH = 160;

export const COLOR_HEIGHT = 240;

export const MONO_HEIGHT = 43;

export const COLOR_NUMBER_OF_LINES = 8;

export const MONO_NUMBER_OF_LINES = 4;

export const COLOR_BYTES_PER_PIXEL = 4;

export const MONO_BYTES_PER_PIXEL = 1;

export const COLOR_WHITE = [255, 255, 255, 255];

export const MONO_WHITE = [255];

export const COLOR_BLACK = [0, 0, 0, 255];

export const MONO_BLACK = [0];

export const COLOR_BITMAP_LENGTH = COLOR_WIDTH * COLOR_HEIGHT * COLOR_BYTES_PER_PIXEL;

export const MONO_BITMAP_LENGTH = MONO_WIDTH * MONO_HEIGHT * MONO_BYTES_PER_PIXEL;

export interface LcdConfig
{
	buttons: Record<string, number>;
	bytesPerPixel: number;
	height: number;
	numberOfLines: number;
	type: number;
	width: number;
}

export const COLOR_CONFIG = Object.freeze({
	type:			COLOR_TYPE,
	buttons: {
		'left':		COLOR_BUTTON_LEFT,
		'right':	COLOR_BUTTON_RIGHT,
		'ok':		COLOR_BUTTON_OK,
		'cancel':	COLOR_BUTTON_CANCEL,
		'up':		COLOR_BUTTON_UP,
		'down':		COLOR_BUTTON_DOWN,
		'menu':		COLOR_BUTTON_MENU,
	},
	width:			COLOR_WIDTH,
	height:			COLOR_HEIGHT,
	numberOfLines:	COLOR_NUMBER_OF_LINES,
	bytesPerPixel:	COLOR_BYTES_PER_PIXEL,
});

export const MONO_CONFIG = Object.freeze({
	type:			MONO_TYPE,
	buttons: {
		'0':		MONO_BUTTON_0,
		'1':		MONO_BUTTON_1,
		'2':		MONO_BUTTON_2,
		'3':		MONO_BUTTON_3,
	},
	width:			MONO_WIDTH,
	height:			MONO_HEIGHT,
	numberOfLines:	MONO_NUMBER_OF_LINES,
	bytesPerPixel:	MONO_BYTES_PER_PIXEL,
});
