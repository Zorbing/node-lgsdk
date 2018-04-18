import { lcd } from '../../index';
import { getDestroyPromise } from '../../lcd/error-messages';


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
