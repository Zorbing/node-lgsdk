import { LOGI_LCD } from './constants';
import { lcdLib } from './ffi-instance';
import { errorMsg } from './error-messages';


export module mono
{
	export const TYPE = LOGI_LCD.mono.type;
	export const BUTTON_0 = LOGI_LCD.mono.buttons['0'];
	export const BUTTON_1 = LOGI_LCD.mono.buttons['1'];
	export const BUTTON_2 = LOGI_LCD.mono.buttons['2'];
	export const BUTTON_3 = LOGI_LCD.mono.buttons['3'];
	export const WIDTH = LOGI_LCD.mono.width;
	export const HEIGHT = LOGI_LCD.mono.height;
	export const BITMAP_LENGTH = WIDTH * HEIGHT * LOGI_LCD.mono.bitsPerPixel;
	export const WHITE = 0;
	export const BLACK = 255;

	export function init(name: string)
	{
		return lcdLib.LogiLcdInit(name, TYPE) as boolean;
	}

	export function isConnected()
	{
		return lcdLib.LogiLcdIsConnected(TYPE) as boolean;
	}

	export function isButtonPressed(button: number)
	{
		if (button !== BUTTON_0 && button !== BUTTON_1 &&
			button !== BUTTON_2 && button !== BUTTON_3)
		{
			throw new Error(errorMsg.buttonId);
		}
		else
		{
			return lcdLib.LogiLcdIsButtonPressed(button) as boolean;
		}
	}
	export function update()
	{
		lcdLib.LogiLcdUpdate();
	}
	export function shutdown()
	{
		lcdLib.LogiLcdShutdown();
	}

	export function setBackground(bitmap: number[])
	{
		if (bitmap.length !== BITMAP_LENGTH)
		{
			throw new Error(errorMsg.bitmapLength(BITMAP_LENGTH));
		}
		else if (bitmap.some((byte) => (byte & 255) !== byte))
		{
			throw new Error(errorMsg.bitmapRange);
		}
		else
		{
			return lcdLib.LogiLcdMonoSetBackground(bitmap) as boolean;
		}
	}
	export function setText(lineNumber: number, text: string)
	{
		if (!Number.isInteger(lineNumber))
		{
			throw new Error(errorMsg.lineIdNotInteger);
		}
		else if (lineNumber < 0 || lineNumber > 3)
		{
			throw new Error(errorMsg.lineId(lineNumber, 4));
		}
		else
		{
			return lcdLib.LogiLcdMonoSetText(lineNumber, text) as boolean;
		}
	}
}


export module color
{
	export const TYPE = LOGI_LCD.color.type;
	export const BUTTON_LEFT = LOGI_LCD.color.buttons['left'];
	export const BUTTON_RIGHT = LOGI_LCD.color.buttons['right'];
	export const BUTTON_OK = LOGI_LCD.color.buttons['ok'];
	export const BUTTON_CANCEL = LOGI_LCD.color.buttons['cancel'];
	export const BUTTON_UP = LOGI_LCD.color.buttons['up'];
	export const BUTTON_DOWN = LOGI_LCD.color.buttons['down'];
	export const BUTTON_MENU = LOGI_LCD.color.buttons['menu'];
	export const WIDTH = LOGI_LCD.color.width;
	export const HEIGHT = LOGI_LCD.color.height;
	export const BITMAP_LENGTH = WIDTH * HEIGHT * LOGI_LCD.color.bitsPerPixel;

	export function init(name: string)
	{
		return lcdLib.LogiLcdInit(name, TYPE) as boolean;
	}

	export function isConnected()
	{
		return lcdLib.LogiLcdIsConnected(TYPE) as boolean;
	}

	export function isButtonPressed(button: number)
	{
		if (button !== BUTTON_LEFT && button !== BUTTON_RIGHT &&
			button !== BUTTON_UP && button !== BUTTON_DOWN &&
			button !== BUTTON_OK && button !== BUTTON_CANCEL &&
			button !== BUTTON_MENU)
		{
			throw new Error(errorMsg.buttonId);
		}
		else
		{
			return lcdLib.LogiLcdIsButtonPressed(button) as boolean;
		}
	}
	export function update()
	{
		lcdLib.LogiLcdUpdate();
	}
	export function shutdown()
	{
		lcdLib.LogiLcdShutdown();
	}

	export function setBackground(bitmap: number[])
	{
		if (bitmap.length !== BITMAP_LENGTH)
		{
			throw new Error(errorMsg.bitmapLength(BITMAP_LENGTH));
		}
		else if (bitmap.some((byte) => (byte & 255) !== byte))
		{
			throw new Error(errorMsg.bitmapRange);
		}
		else
		{
			return lcdLib.LogiLcdColorSetBackground(bitmap) as boolean;
		}
	}
	export function setTitle(text: string, red = 255, green = 255, blue = 255)
	{
		if ((red & 255) !== red ||
			(green & 255) !== green ||
			(blue & 255) !== blue)
		{
			throw new Error(errorMsg.colorByte);
		}
		else
		{
			return lcdLib.LogiLcdColorSetTitle(text, red, green, blue) as boolean;
		}
	}
	export function setText(lineNumber: number, text: string, red = 255, green = 255, blue = 255)
	{
		if (!Number.isInteger(lineNumber))
		{
			throw new Error(errorMsg.lineIdNotInteger);
		}
		else if (lineNumber < 0 || lineNumber > 7)
		{
			throw new Error(errorMsg.lineId(lineNumber, 7));
		}
		else if ((red & 255) !== red ||
			(green & 255) !== green ||
			(blue & 255) !== blue)
		{
			throw new Error(errorMsg.colorByte);
		}
		else
		{
			return lcdLib.LogiLcdColorSetText(lineNumber, text, red, green, blue) as boolean;
		}
	}
}
