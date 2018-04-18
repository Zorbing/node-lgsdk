import * as bmp from 'bmp-js';
import * as fs from 'fs';

import { LogiLcd } from '../..';


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

function fillBitmap(instance: LogiLcd, colorFn: (i: number) => number[])
{
	let bitmap: number[] = [];
	for (let i = 0; i < instance.bitmapLength; i++)
	{
		const color = colorFn(i);
		for (let j = 0; j < color.length; j++, i++)
		{
			bitmap[i] = color[j];
		}
		i--;
	}
	return bitmap;
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

	const bitmap = fillBitmap(instance, () => instance.white);
	instance.setBackground(bitmap);

	instance.update();
}

export function testBlackBackground()
{
	const instance = init();
	resetText(instance);

	const bitmap = fillBitmap(instance, () => instance.black);
	instance.setBackground(bitmap);

	instance.update();
}

export function testRandomBackground()
{
	const instance = init();
	resetText(instance);

	const bitmap = fillBitmap(instance, () =>
	{
		return Math.random() < .5 ? instance.white : instance.black;
	});
	instance.setBackground(bitmap);

	instance.update();
}

const testAssetsPath = './src/tests/assets/';
export function testImageBackground()
{
	const instance = init();
	resetText(instance);

	fs.readFile(testAssetsPath + 'LogiLogoMono.bmp', (error, data) =>
	{
		if (error)
		{
			console.log('error:', error);
		}
		else
		{
			const bmpData = bmp.decode(data);
			const bitmap = instance.convertImage2Array(bmpData.data);
			instance.setBackground(bitmap);
			instance.update();
		}
	});
}

export function testInvertedImageBackground()
{
	const instance = init();
	resetText(instance);

	fs.readFile(testAssetsPath + 'LogiLogoMonoInverted.bmp', (error, data) =>
	{
		if (error)
		{
			console.log('error:', error);
		}
		else
		{
			const bmpData = bmp.decode(data);
			const bitmap = instance.convertImage2Array(bmpData.data);
			instance.setBackground(bitmap);
			instance.update();
		}
	});
}
