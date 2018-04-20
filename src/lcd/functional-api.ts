import { BITMAP_LENGTH_COLOR, BITMAP_LENGTH_MONO, LOGI_LCD } from './constants';
import { errorMsg } from './error-messages';
import {
    isButtonValid,
    isButtonValidForColor,
    isButtonValidForMono,
    isValidBitmapValues,
    isValidColorBitmapLength,
    isValidMonoBitmapLength,
    lcdLib,
} from './ffi-lib';


export function init(name: string, type: number)
{
	return lcdLib.LogiLcdInit(name, type) as boolean;
}

export function isButtonPressed(button: number)
{
	if (!isButtonValid(button))
	{
		throw new Error(errorMsg.buttonId);
	}
	else
	{
		return lcdLib.LogiLcdIsButtonPressed(button) as boolean;
	}
}

export function isConnected(type: number)
{
	return lcdLib.LogiLcdIsConnected(type) as boolean;
}

export function setColorBackground(bitmap: number[])
{
	if (!isValidColorBitmapLength(bitmap))
	{
		throw new Error(errorMsg.bitmapLength(BITMAP_LENGTH_COLOR));
	}
	else if (!isValidBitmapValues(bitmap))
	{
		throw new Error(errorMsg.bitmapRange);
	}
	else
	{
		return lcdLib.LogiLcdColorSetBackground(bitmap) as boolean;
	}
}

export function setMonoBackground(bitmap: number[])
{
	if (!isValidMonoBitmapLength(bitmap))
	{
		throw new Error(errorMsg.bitmapLength(BITMAP_LENGTH_MONO));
	}
	else if (!isValidBitmapValues(bitmap))
	{
		throw new Error(errorMsg.bitmapRange);
	}
	else
	{
		return lcdLib.LogiLcdMonoSetBackground(bitmap) as boolean;
	}
}

export function setColorText(lineNumber: number, text: string, red = 255, green = 255, blue = 255)
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

export function setMonoText(lineNumber: number, text: string)
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

export function setColorTitle(text: string, red = 255, green = 255, blue = 255)
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

export function shutdown()
{
	return lcdLib.LogiLcdShutdown();
}

export function update()
{
	return lcdLib.LogiLcdUpdate();
}

const generalApi = {
	init,
	isButtonPressed,
	isConnected,
	setColorBackground,
	setMonoBackground,
	setColorText,
	setMonoText,
	setColorTitle,
	shutdown,
	update,
};


export module mono
{
	export const TYPE = LOGI_LCD.mono.type;
	export const BUTTON_0 = LOGI_LCD.mono.buttons['0'];
	export const BUTTON_1 = LOGI_LCD.mono.buttons['1'];
	export const BUTTON_2 = LOGI_LCD.mono.buttons['2'];
	export const BUTTON_3 = LOGI_LCD.mono.buttons['3'];
	export const WIDTH = LOGI_LCD.mono.width;
	export const HEIGHT = LOGI_LCD.mono.height;
	export const BITMAP_LENGTH = BITMAP_LENGTH_MONO;
	export const WHITE = 0;
	export const BLACK = 255;

	export function init(name: string)
	{
		return generalApi.init(name, TYPE);
	}

	export function isButtonPressed(button: number)
	{
		if (!isButtonValidForMono(button))
		{
			throw new Error(errorMsg.buttonId);
		}
		else
		{
			return generalApi.isButtonPressed(button);
		}
	}

	export function isConnected()
	{
		return generalApi.isConnected(TYPE);
	}

	export function setBackground(bitmap: number[])
	{
		return generalApi.setMonoBackground(bitmap);
	}

	export function setText(lineNumber: number, text: string)
	{
		return generalApi.setMonoText(lineNumber, text);
	}

	export function shutdown()
	{
		return generalApi.shutdown();
	}

	export function update()
	{
		return generalApi.update();
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
	export const BITMAP_LENGTH = BITMAP_LENGTH_COLOR;

	export function init(name: string)
	{
		return generalApi.init(name, TYPE);
	}

	export function isButtonPressed(button: number)
	{
		if (!isButtonValidForColor(button))
		{
			throw new Error(errorMsg.buttonId);
		}
		else
		{
			return generalApi.isButtonPressed(button);
		}
	}

	export function isConnected()
	{
		return generalApi.isConnected(TYPE);
	}

	export function setBackground(bitmap: number[])
	{
		return generalApi.setColorBackground(bitmap);
	}

	export function setText(lineNumber: number, text: string, red?: number, green?: number, blue?: number)
	{
		return generalApi.setColorText(lineNumber, text, red, green, blue);
	}

	export function setTitle(text: string, red?: number, green?: number, blue?: number)
	{
		return generalApi.setColorTitle(text, red, green, blue);
	}

	export function shutdown()
	{
		return generalApi.shutdown();
	}

	export function update()
	{
		return generalApi.update();
	}
}
