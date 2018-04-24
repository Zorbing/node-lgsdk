/**
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

import { LogiGkey } from '../..';


function init()
{
	const instance = LogiGkey.getInstance();
	if (!instance.initialized)
	{
		instance.init();
	}
	console.log('initialized:', instance.initialized);

	return instance;
}

export function testPressedKeys(ms: number)
{
	const instance = init();

	const gKeyNumber = 4;
	const modeNumber = 1;
	const keyString = instance.getKeyboardGkeyString(gKeyNumber, modeNumber);
	console.log(`You can press G${gKeyNumber} in M${modeNumber} mode (${keyString}) and observe the state changes here.`);

	const timeStep = 100;
	let lastState = false;
	let remainingMs = ms;
	return new Promise<void>((resolve, reject) =>
	{
		const interval = setInterval(() =>
		{
			let state = instance.isKeyboardGkeyPressed(gKeyNumber, modeNumber);
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

export function testGeneralEventListener(ms: number)
{
	const instance = init();

	console.log('Press any G-Key down to test.');
	instance.addEventListener('keyDown', (event) =>
	{
		console.log('key down detected:', event);
	});

	return new Promise<void>((resolve, reject) =>
	{
		setTimeout(() =>
		{
			instance.removeAllEventListeners();
			resolve();
		}, ms);
	});
}

export function testSpecificEventListener(ms: number)
{
	const instance = init();

	console.log('Press any G4 key down to test.');
	const gKeyNumber = 4;
	const modeNumber = 1;
	const keyString = instance.getKeyboardGkeyString(gKeyNumber, modeNumber);
	console.log(`Press or release G${gKeyNumber} in M${modeNumber} mode (${keyString}) to test.`);

	instance.addEventListener(keyString, (event) =>
	{
		console.log(`key event for ${keyString} detected:`, event);
	});

	return new Promise<void>((resolve, reject) =>
	{
		setTimeout(() =>
		{
			instance.removeAllEventListeners();
			resolve();
		}, ms);
	});
}
