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

import { lcd } from '../..';
import { getDestroyPromise } from '../../error';


let isRunning = false;
function init()
{
	const success = lcd.mono.init('Test');
	console.log('success:', success);

	const connected = lcd.mono.isConnected();
	console.log('connected:', connected);

	if (!isRunning)
	{
		isRunning = true;
		getDestroyPromise().then(() => shutdown());
	}
}

export function shutdown()
{
	if (isRunning)
	{
		console.log('shutting down old api');
		lcd.mono.shutdown();
		isRunning = false;
	}
}

export function testText()
{
	init();

	lcd.mono.setText(0, 'This is the first line of text...');
	lcd.mono.setText(1, '');
	lcd.mono.setText(2, '');
	lcd.mono.setText(3, 'Last (4.) line with index 3.');

	lcd.mono.update();
}

export function testBackground()
{
	init();

	const bitmap: number[] = [];
	for (let i = 0; i < lcd.mono.BITMAP_LENGTH; i++)
	{
		bitmap[i] = Math.random() < .5 ? lcd.mono.WHITE : lcd.mono.BLACK;
	}
	lcd.mono.setBackground(bitmap);

	lcd.mono.update();
}
