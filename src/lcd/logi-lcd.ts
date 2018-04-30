/**
 * @module node-lgsdk/lcd
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
import { getDestroyPromise } from '../error';
import {
    COLOR_BITMAP_LENGTH,
    COLOR_CONFIG,
    COLOR_TYPE,
    LcdConfig,
    MONO_BITMAP_LENGTH,
    MONO_CONFIG,
    MONO_TYPE,
} from './constants';
import { errorMsg } from './error-messages';
import {
    convert2Grayscale,
    init,
    isButtonPressed,
    isConnected,
    setColorBackground,
    setColorText,
    setColorTitle,
    setMonoBackground,
    setMonoText,
    shutdown,
    update,
} from './functional-api';


/**
 * @private
 */
interface Color2GrayscaleConversionFunction
{
	(red: number, green: number, blue: number, alpha?: number): number;
}

export enum COLOR_TO_GRAYSCALE_CONVERSION
{
	average,
	lightness,
	luminosity,
}


export class LogiLcd
{
	private static _instance: LogiLcd | null = null;



	public static BUTTON_LIST_COLOR = Object.keys(COLOR_CONFIG.buttons)
		.map(buttonKey => COLOR_CONFIG.buttons[buttonKey])
	;
	public static BUTTON_LIST_MONO = Object.keys(MONO_CONFIG.buttons)
		.map(buttonKey => MONO_CONFIG.buttons[buttonKey])
	;



	private _autoUpdate = false;
	private _config: LcdConfig;
	private _color2Grayscale: Color2GrayscaleConversionFunction;
	private _initialized = false;



	public get black()
	{
		return this._config.black;
	}

	public bitmapLength: number = 0;

	public get initialized()
	{
		return this._initialized;
	}

	public isColor = false;
	public name: string | null = null;

	public get white()
	{
		return this._config.white;
	}



	private constructor()
	{
		this.setGrayscaleConversion(COLOR_TO_GRAYSCALE_CONVERSION.luminosity);
	}



	public static getInstance()
	{
		if (!this._instance)
		{
			this._instance = new LogiLcd();
		}
		return this._instance;
	}



	public convertImage2Array(buffer: Buffer)
	{
		const array = [...buffer];
		if (this.isColor)
		{
			return array;
		}
		else
		{
			const bitmap = new Array<number>(this.bitmapLength);
			for (let i = 0; i < this.bitmapLength; i++)
			{
				const j = i * 4;
				bitmap[i] = this._color2Grayscale(
					array[j + 0],
					array[j + 1],
					array[j + 2],
					array[j + 3],
				);
			}
			return bitmap;
		}
	}

	public disableAutoUpdate()
	{
		this._autoUpdate = false;
	}

	public enableAutoUpdate()
	{
		this._autoUpdate = true;
	}

	public init(name: string, type = MONO_TYPE | COLOR_TYPE)
	{
		if (this.initialized)
		{
			throw new Error(errorMsg.alreadyInitialized);
		}

		this.name = name;
		this._initialized = init(name, type);
		if (this.initialized)
		{
			this.isColor = this.isConnected(COLOR_TYPE);
			if (this.isColor)
			{
				this._config = COLOR_CONFIG;
				this.bitmapLength = COLOR_BITMAP_LENGTH;
			}
			else
			{
				this._config = MONO_CONFIG;
				this.bitmapLength = MONO_BITMAP_LENGTH;
			}

			getDestroyPromise().then(() => this.shutdown());
			return true;
		}
		else
		{
			return false;
		}
	}

	public isButtonPressed(button: number): boolean
	{
		if (!this.initialized)
		{
			throw new Error(errorMsg.notInitialized);
		}

		return isButtonPressed(button);
	}

	public isConnected(type?: number): boolean
	{
		if (!this.initialized)
		{
			return false;
		}
		else
		{
			if (type === undefined)
			{
				type = this._config.type;
			}
			return isConnected(type);
		}
	}

	public setBackground(bitmap: number[]): boolean
	{
		if (!this.initialized)
		{
			throw new Error(errorMsg.notInitialized);
		}

		let result = false;
		if (this.isColor)
		{
			result = setColorBackground(bitmap);
		}
		else
		{
			result = setMonoBackground(bitmap);
		}
		if (this._autoUpdate)
		{
			this.update();
		}
		return result;
	}

	/**
	 * Sets the function which will be used to convert color information to grayscale.
	 *
	 * @param conversion The conversion type which should be used
	 */
	public setGrayscaleConversion(conversionType: COLOR_TO_GRAYSCALE_CONVERSION)
	{
		if (conversionType === COLOR_TO_GRAYSCALE_CONVERSION.average)
		{
			this._color2Grayscale = convert2Grayscale.average;
		}
		else if (conversionType === COLOR_TO_GRAYSCALE_CONVERSION.lightness)
		{
			this._color2Grayscale = convert2Grayscale.lightness;
		}
		else if (conversionType === COLOR_TO_GRAYSCALE_CONVERSION.luminosity)
		{
			this._color2Grayscale = convert2Grayscale.luminosity;
		}
		else
		{
			throw new Error('Unknown image conversion type: ' + conversionType);
		}
	}

	public setText(text: string | string[], lineNumber?: number | null, red?: number, green?: number, blue?: number): boolean
	{
		if (!this.initialized)
		{
			throw new Error(errorMsg.notInitialized);
		}

		let result = false;
		if (text instanceof Array)
		{
			result = true;
			for (let i = 0; i < text.length; i++)
			{
				result = result && this.setText(text[i], i, red, green, blue);
			}
		}
		else if (lineNumber != null)
		{
			if (this.isColor)
			{
				result = setColorText(lineNumber, text, red, green, blue);
			}
			else
			{
				result = setMonoText(lineNumber, text);
			}
			if (this._autoUpdate)
			{
				this.update();
			}
		}
		return result;
	}

	public setTitle(text: string, red?: number, green?: number, blue?: number)
	{
		if (!this.initialized)
		{
			throw new Error(errorMsg.notInitialized);
		}

		let result = false;
		if (this.isColor)
		{
			result = setColorTitle(text, red, green, blue);
			if (this._autoUpdate)
			{
				this.update();
			}
		}
		return result;
	}

	public shutdown()
	{
		if (this.initialized)
		{
			shutdown();
			this._initialized = false;
			return true;
		}
		else
		{
			return false;
		}
	}

	public update()
	{
		if (!this.initialized)
		{
			throw new Error(errorMsg.notInitialized);
		}

		update();
	}
}
