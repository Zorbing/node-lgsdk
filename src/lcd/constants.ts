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

export interface LcdConfig
{
	buttons: Record<string, number>;
	bytesPerPixel: number;
	height: number;
	numberOfLines: number;
	type: number;
	width: number;
}

export const LOGI_LCD = {
	color: {
		type:			0x00000002,
		buttons: {
			'left':		0x00000100,
			'right':	0x00000200,
			'ok':		0x00000400,
			'cancel':	0x00000800,
			'up':		0x00001000,
			'down':		0x00002000,
			'menu':		0x00004000,
		},
		width:			320,
		height:			240,
		numberOfLines:	8,
		bytesPerPixel:	4,
	},
	mono: {
		type:			0x00000001,
		buttons: {
			'0':		0x00000001,
			'1':		0x00000002,
			'2':		0x00000004,
			'3':		0x00000008,
		},
		width:			160,
		height:			43,
		numberOfLines:	4,
		bytesPerPixel:	1,
	},
};

// blue, green, red, alpha
export const WHITE = [255, 255, 255, 255];
// blue, green, red, alpha
export const BLACK = [0, 0, 0, 255];

export const BITMAP_LENGTH_COLOR = LOGI_LCD.color.width * LOGI_LCD.color.height * LOGI_LCD.color.bytesPerPixel;
export const BITMAP_LENGTH_MONO = LOGI_LCD.mono.width * LOGI_LCD.mono.height * LOGI_LCD.mono.bytesPerPixel;
