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

	console.log('Press any G4 key -Key down to test.');
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
