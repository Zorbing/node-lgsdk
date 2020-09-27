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

import { gKey } from '../..';
import { getDestroyPromise } from '../../error';
import { logiGkeyCB, logiGkeyCBContext } from '../../g-key/ffi-lib';


let isRunning = false;
function init(callback?: logiGkeyCB | logiGkeyCBContext)
{
	gKey.init(callback);

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
		gKey.shutdown();
		isRunning = false;
	}
}

export function testPressedKeys(ms: number)
{
	init();

	const gKeyNumber = 4;
	const modeNumber = 1;
	const keyString = gKey.getKeyboardGkeyString(gKeyNumber, modeNumber);
	console.log(`You can press G${gKeyNumber} in M${modeNumber} mode (${keyString}) and observe the state changes here.`);

	const timeStep = 100;
	let lastState = false;
	let remainingMs = ms;
	return new Promise<void>((resolve, reject) =>
	{
		const interval = setInterval(() =>
		{
			let state = gKey.isKeyboardGkeyPressed(gKeyNumber, modeNumber);
			if (state !== lastState)
			{
				lastState = state;
				console.log('changed state! pressed:', state);
			}

			remainingMs -= timeStep;
			if (remainingMs <= 0)
			{
				clearInterval(interval);
				resolve();
			}
		}, timeStep);
	});
}

export function testCallback(ms: number)
{
	init((gkeyCode, gkeyOrButtonString, context) =>
	{
		console.log('key state changed:', gkeyCode, gkeyOrButtonString, context);
	});

	return new Promise<void>((resolve, reject) =>
	{
		setTimeout(() => resolve(), ms);
	});
}

export function testContext(ms: number)
{
	init({
		gkeyCallBack: function (gkeyCode, gkeyOrButtonString, context)
		{
			console.log('key state changed:', gkeyCode, gkeyOrButtonString, context, 'this:', this);
		},
		gkeyContext: { test: 'hello' },
	});

	return new Promise<void>((resolve, reject) =>
	{
		setTimeout(() => resolve(), ms);
	});
}
