import { lcd, LogiLcd } from '../index';


function init()
{
	const instance = LogiLcd.getInstance();
	if (!instance.initialized)
	{
		instance.init('Test');
	}
	console.log('initialized:', instance.initialized);

	const isConnected = instance.isConnected();
	console.log('isConnected:', isConnected);

	return instance;
}

export function testText()
{
	const instance = init();

	instance.setText([
		'This is the first line of text...',
		'',
		'',
		'Last (4.) line with index 3.',
	]);

	instance.update();
}

export function testBackground()
{
	const instance = init();

	let bitmap: number[] = [];
	for (let i = 0; i < instance.bitmapLength; i++)
	{
		// TODO: change lcd.mono.WHITE/lcd.mono.BLACK to something color independent
		bitmap[i] = Math.random() < .5 ? lcd.mono.WHITE : lcd.mono.BLACK;
	}
	instance.setBackground(bitmap);

	instance.update();
}
