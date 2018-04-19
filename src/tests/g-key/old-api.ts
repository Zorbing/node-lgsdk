import { gKey } from '../..';
import { getDestroyPromise } from '../../error';
import { logiGkeyCB, logiGkeyCBContext } from '../../g-key/ffi-instance';


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

	const timeStep = 100;
	let lastState = false;
	let remainingMs = ms;
	console.log('You can press G1 in M1 mode and observe the state changes here.');
	return new Promise<void>((resolve, reject) =>
	{
		const interval = setInterval(() =>
		{
			let state = gKey.isKeyboardGkeyPressed(1, 1);
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
	gKey.init((gkeyCode, gkeyOrButtonString, context) =>
	{
		console.log('key state changed:', gkeyCode, gkeyOrButtonString, context);
	});

	return new Promise<void>((resolve, reject) =>
	{
		setTimeout(() =>
		{
			resolve();
		}, ms);
	});
}
