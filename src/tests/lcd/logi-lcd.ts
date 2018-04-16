import * as bmp from 'bmp-js';
import * as fs from 'fs';

import { lcd, LogiLcd } from '../..';


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

function resetText(instance: LogiLcd)
{
	instance.setText([
		'',
		'',
		'',
		'',
	]);
	instance.update();
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

/** On the G15 the colors white and black are switched... */

export function testWhiteBackground()
{
	const instance = init();
	resetText(instance);

	let bitmap: number[] = [];
	for (let i = 0; i < instance.bitmapLength; i++)
	{
		// TODO: change lcd.mono.WHITE to something color independent
		bitmap[i] = lcd.mono.WHITE;
	}
	instance.setBackground(bitmap);

	instance.update();
}

export function testBlackBackground()
{
	const instance = init();
	resetText(instance);

	let bitmap: number[] = [];
	for (let i = 0; i < instance.bitmapLength; i++)
	{
		// TODO: change lcd.mono.BLACK to something color independent
		bitmap[i] = lcd.mono.BLACK;
	}
	instance.setBackground(bitmap);

	instance.update();
}

export function testRandomBackground()
{
	const instance = init();
	resetText(instance);

	let bitmap: number[] = [];
	for (let i = 0; i < instance.bitmapLength; i++)
	{
		// TODO: change lcd.mono.WHITE/lcd.mono.BLACK to something color independent
		const color = Math.random() < .5 ? [lcd.mono.WHITE] : [lcd.mono.BLACK];
		for (let j = 0; j < color.length; j++)
		{
			if (j !== 0)
			{
				i++;
			}
			bitmap[i] = color[j];
		}
	}
	instance.setBackground(bitmap);

	instance.update();
}
