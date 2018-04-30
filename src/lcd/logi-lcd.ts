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
import { COLOR_CONFIG, COLOR_TYPE, LcdConfig, MONO_CONFIG, MONO_TYPE } from './constants';
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
	/**
	 * @hidden
	 */
	private static _instance: LogiLcd | null = null;



	/**
	 * A list of all valid button codes for color LCD devices.
	 */
	public static BUTTON_LIST_COLOR = Object.keys(COLOR_CONFIG.buttons)
		.map<number>(buttonKey => COLOR_CONFIG.buttons[buttonKey])
	;
	/**
	 * A list of all valid button codes for monochrome LCD devices.
	 */
	public static BUTTON_LIST_MONO = Object.keys(MONO_CONFIG.buttons)
		.map<number>(buttonKey => MONO_CONFIG.buttons[buttonKey])
	;



	/**
	 * @hidden
	 */
	private _autoUpdate = false;
	/**
	 * @hidden
	 */
	private _config: LcdConfig;
	/**
	 * The default is conversion by luminosity.
	 *
	 * @hidden
	 */
	private _color2Grayscale: Color2GrayscaleConversionFunction;
	/**
	 * @hidden
	 */
	private _initialized = false;



	/**
	 * @see {@link LcdConfig.black}
	 */
	public get black()
	{
		return this._config.black;
	}

	/**
	 * @see {@link LcdConfig.bitmapLength}
	 */
	public get bitmapLength()
	{
		return this._config.bitmapLength;
	}

	/**
	 * Whether the LCD connection is already initialized.
	 */
	public get initialized()
	{
		return this._initialized;
	}

	/**
	 * Whether the device connected to does support colors.
	 */
	public isColor = false;
	/**
	 * The name of the applet given at init.
	 */
	public name: string | null = null;

	/**
	 * @see {@link LcdConfig.white}
	 */
	public get white()
	{
		return this._config.white;
	}



	/**
	 * There can be only one connection at a time.
	 * To avoid mistakes, the constructor must not be called directly.
	 *
	 * Instead, use {@link getInstance}: `LogiLcd.getInstance()`
	 */
	private constructor()
	{
		this.setGrayscaleConversion(COLOR_TO_GRAYSCALE_CONVERSION.luminosity);
	}



	/**
	 * Returns the instance of `LogiLcd`.
	 * If there does not exist one, the function creates one, stores it locally and returns a reference to it.
	 */
	public static getInstance()
	{
		if (!this._instance)
		{
			this._instance = new LogiLcd();
		}
		return this._instance;
	}



	/**
	 * Converts a given image buffer into an array which can be passed to {@link setBackground}.
	 *
	 * @param buffer The image buffer with the color information for red, green, blue, and alpha.
	 * @returns A bitmap array either for a color, or for a monochrome LCD device.
	 */
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

	/**
	 * Disables automatically updating the display at execution of {@link setBackground}, {@link setText}, or {@link setTitle}.
	 */
	public disableAutoUpdate()
	{
		this._autoUpdate = false;
	}

	/**
	 * Enables automatically updating the display at execution of {@link setBackground}, {@link setText}, or {@link setTitle}.
	 */
	public enableAutoUpdate()
	{
		this._autoUpdate = true;
	}

	/**
	 * Initializes the connection with the device.
	 * This method has to be called exactly once before calling other methods.
	 * After a successfully initialization, the property {@link initialized} will be set to `true`.
	 *
	 * If the connection is already initialized, calling this method will throw an error.
	 *
	 * @param name The applet's name.
	 * @param type The type of device this api is supposed to connect to.
	 * By default it will try to connect to any device type available.
	 *
	 * @returns If the init call was successfully, returns `true`.
	 * Otherwise `false`.
	 */
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
			this._config = this.isColor ? COLOR_CONFIG : MONO_CONFIG;
			getDestroyPromise().then(() => this.shutdown());
			return true;
		}
		else
		{
			return false;
		}
	}

	/**
	 * Checks whether the given button is pressed.
	 *
	 * Throws an error if the connection is not initialized.
	 * This can be either because {@link init} has not been called yet, because the {@link init}-call did not return `true`, or because {@link shutdown} has been executed.
	 *
	 * @param button The button number to check for being pressed.
	 */
	public isButtonPressed(button: number): boolean
	{
		if (!this.initialized)
		{
			throw new Error(errorMsg.notInitialized);
		}

		return isButtonPressed(button);
	}

	/**
	 * Checks whether there exists a connection to a device of the given type.
	 * If the type is not specified, the type of the current connection is used.
	 * If no connection is available ({@link init} has not been called yet), it returns `false`.
	 *
	 * @param type The devices type to check for.
	 *
	 * @returns If a device is connected, it returns `true`. Otherwise `false`.
	 */
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

	/**
	 * Sets the background bitmap which is displayed in the LCD of the device.
	 * If this api is connected to a color device ({@link isColor}), the length of the bitmap has to be different than when connected to a monochrome device.
	 *
	 * If auto update is enabled and the background was successfully set, the method will call {@link update} before returning the result.
	 *
	 * Throws an error if the connection is not initialized ({@link init} must be called).
	 *
	 * @param bitmap The bitmap as a number array.
	 * The size has to fit to the underlying connected device (see {@link convertImage2Array}).
	 *
	 * @returns Whether the background setting was successfully.
	 */
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
		if (result && this._autoUpdate)
		{
			this.update();
		}
		return result;
	}

	/**
	 * Sets the function which will be used to convert color information to grayscale.
	 * By default, the function for conversion by luminosity is used.
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

	/**
	 * Writes a given text in the given color on the given line on the device's display.
	 * On monochrome devices, the color arguments will be ignored.
	 * The default color on color displays is white.
	 *
	 * If an array of `n` text lines is given, the first `n` text lines of the display are set.
	 * All `n` text lines will have the same color as specified in `red`, `green`, and `blue` (provided the connected device does support colors).
	 *
	 * If auto update is enabled and the text line(s) are successfully set, the method will call {@link update} before returning the result.
	 *
	 * Throws an error if the connection is not initialized (call {@link init} to do so).
	 *
	 * @param text Either the line's string, or an array of strings which are drawn on the device's display.
	 * @param lineNumber The line number where to draw the given text (for string arrays this will be ignored and can be set to `null` or `undefined`).
	 * @param red The red value of the text.
	 * This will be ignored for monochrome devices.
	 * @param green The green value of the text.
	 * This will be ignored for monochrome devices.
	 * @param blue The blue value of the text.
	 * This will be ignored for monochrome devices.
	 *
	 * @returns If the text line was set, returns `true`.
	 * If there was an array of text lines given, it returns `true` if all of the lines are set successfully.
	 * Otherwise `false`.
	 */
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
			// disable auto update as long as every line of text is set and check once after everything is finished
			const autoUpdate = this._autoUpdate;
			this._autoUpdate = false;
			for (let i = 0; i < text.length; i++)
			{
				try
				{
					result = result && this.setText(text[i], i, red, green, blue);
				}
				catch (error)
				{
					// restore the value of auto update before re-throwing the error
					this._autoUpdate = autoUpdate;
					throw error;
				}
			}
			this._autoUpdate = autoUpdate;
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
		}
		if (result && this._autoUpdate)
		{
			this.update();
		}
		return result;
	}

	/**
	 * Sets the text of the first line in a color supporting device's LCD.
	 * If a monochrome device is connected, calling this method does not set any content.
	 * The text in the first line is written in a bigger font than the other lines, so this line acts as a title for your applet.
	 * The default color is white.
	 *
	 * If auto update is enabled and the text line(s) are successfully set, the method will call {@link update} before returning the result.
	 *
	 * Throws an error if the connection is not initialized ({@link init} must be called).
	 *
	 * @param text The title string which will be drawn on the device's display.
	 * @param red The red value of the title.
	 * This will be ignored for monochrome devices.
	 * @param green The green value of the title.
	 * This will be ignored for monochrome devices.
	 * @param blue The blue value of the title.
	 * This will be ignored for monochrome devices.
	 *
	 * @returns If the title was set, it returns `true`.
	 * Otherwise `false`.
	 */
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
		}
		if (result && this._autoUpdate)
		{
			this.update();
		}
		return result;
	}

	/**
	 * This method kills the applet and frees memory used by the SDK.
	 *
	 * All object references held by this API wrapper are set to `null` and therefore can be garbage collected.
	 * This does not destroy the instance returned by `LogiLcd.getInstance()` and also does not reset the color-to-grayscale conversion set by {@link setGrayscaleConversion}.
	 */
	public shutdown()
	{
		if (this.initialized)
		{
			shutdown();
			this._initialized = false;
			// It is not necessary to set `_config` to `null`, since a reference to the same object is still stored in either `MONO_CONFIG` or `COLOR_CONFIG`.
			// this._config = null;
			this.name = null;
			return true;
		}
		else
		{
			return false;
		}
	}

	/**
	 * Updates the LCD display.
	 * Every time something is changed (either {@link setBackground}, {@link setText}, or {@link setTitle} is called), this method has to be called.
	 *
	 * If auto update is enabled (see {@link enableAutoUpdate} and {@link disableAutoUpdate}), the above mentioned methods are calling this method on their own.
	 *
	 * Throws an error if the connection is not initialized ({@link init} must be called).
	 */
	public update()
	{
		if (!this.initialized)
		{
			throw new Error(errorMsg.notInitialized);
		}

		update();
	}
}
