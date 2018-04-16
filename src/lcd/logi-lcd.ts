import { LcdConfig, LOGI_LCD, BLACK, WHITE } from './constants';
import { errorMsg, addDestroyHandler } from './error-messages';
import { lcdLib } from './ffi-instance';


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



	public static BUTTON_LIST_COLOR = Object.keys(LOGI_LCD.color.buttons)
		.map(buttonKey => LOGI_LCD.color.buttons[buttonKey])
	;
	public static BUTTON_LIST_MONO = Object.keys(LOGI_LCD.mono.buttons)
		.map(buttonKey => LOGI_LCD.mono.buttons[buttonKey])
	;



	private _autoUpdate = false;
	private _buttonList: number[] = [];
	private _config: LcdConfig;
	private _color2Grayscale: Color2GrayscaleConversionFunction;
	private _initialized = false;



	public black: number[];
	public bitmapLength: number = 0;

	public get initialized()
	{
		return this._initialized;
	}

	public isColor = false;
	public name: string | null = null;
	public white: number[];



	private constructor()
	{
		this._toGrayscaleAverage = this._toGrayscaleAverage.bind(this);
		this._toGrayscaleLightness = this._toGrayscaleLightness.bind(this);
		this._toGrayscaleLuminosity = this._toGrayscaleLuminosity.bind(this);

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

	public init(name: string, type = LOGI_LCD.mono.type | LOGI_LCD.color.type)
	{
		if (this.initialized)
		{
			throw new Error(errorMsg.alreadyInitialized);
		}

		this.name = name;
		this._initialized = lcdLib.LogiLcdInit(name, type);
		if (this.initialized)
		{
			this.isColor = this.isConnected(LOGI_LCD.color.type);
			if (this.isColor)
			{
				this._config = {
					...LOGI_LCD.color,
				};
				this.bitmapLength = this._config.width * this._config.height * 4;
				this._buttonList = [...LogiLcd.BUTTON_LIST_COLOR];
				this.black = [...BLACK];
				this.white = [...WHITE];
			}
			else
			{
				this._config = {
					...LOGI_LCD.mono,
				};
				this.bitmapLength = this._config.width * this._config.height * 1;
				this._buttonList = [...LogiLcd.BUTTON_LIST_MONO];
				this.black = [this._color2Grayscale(BLACK[0], BLACK[1], BLACK[2], BLACK[3])];
				this.white = [this._color2Grayscale(WHITE[0], WHITE[1], WHITE[2], WHITE[3])];
			}

			addDestroyHandler(() =>
			{
				console.log('shutting down');
				this.shutdown();
			});
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

		if (this._buttonList.indexOf(button) === -1)
		{
			throw new Error(errorMsg.buttonId);
		}
		else
		{
			return lcdLib.LogiLcdIsButtonPressed(button);
		}
	}

	public isConnected(type?: number): boolean
	{
		if (!this.initialized)
		{
			return false;
		}
		else if (type === undefined)
		{
			return this.isConnected(this._config.type);
		}
		else
		{
			return lcdLib.LogiLcdIsConnected(type);
		}
	}

	public setBackground(bitmap: number[]): boolean
	{
		if (!this.initialized)
		{
			throw new Error(errorMsg.notInitialized);
		}

		let result = false;
		if (this._checkBitmap(bitmap))
		{
			if (this.isColor)
			{
				result = lcdLib.LogiLcdColorSetBackground(bitmap);
			}
			else
			{
				result = lcdLib.LogiLcdMonoSetBackground(bitmap);
			}
			if (this._autoUpdate)
			{
				this.update();
			}
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
			this._color2Grayscale = this._toGrayscaleAverage;
		}
		else if (conversionType === COLOR_TO_GRAYSCALE_CONVERSION.lightness)
		{
			this._color2Grayscale = this._toGrayscaleLightness;
		}
		else if (conversionType === COLOR_TO_GRAYSCALE_CONVERSION.luminosity)
		{
			this._color2Grayscale = this._toGrayscaleLuminosity;
		}
		else
		{
			throw new Error('Unknown image conversion type: ' + conversionType);
		}
	}

	public setText(text: string | string[], lineNumber?: number | null, red = 255, green = 255, blue = 255): boolean
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
		else if (lineNumber != null && this._checkLineNumber(lineNumber))
		{
			if (this.isColor)
			{
				if (this._checkColors(red, green, blue))
				{
					result = lcdLib.LogiLcdColorSetText(lineNumber, text, red, green, blue);
				}
			}
			else
			{
				result = lcdLib.LogiLcdMonoSetText(lineNumber, text);
			}
			if (this._autoUpdate)
			{
				this.update();
			}
		}
		return result;
	}

	public setTitle(text: string, red = 255, green = 255, blue = 255): boolean
	{
		if (!this.initialized)
		{
			throw new Error(errorMsg.notInitialized);
		}

		let result = false;
		if (this.isColor)
		{
			if (this._checkColors(red, green, blue))
			{
				result = lcdLib.LogiLcdColorSetTitle(text, red, green, blue);
				if (this._autoUpdate)
				{
					this.update();
				}
			}
		}
		return result;
	}

	public shutdown()
	{
		if (!this.initialized)
		{
			throw new Error(errorMsg.notInitialized);
		}

		lcdLib.LogiLcdShutdown();
	}

	public update()
	{
		if (!this.initialized)
		{
			throw new Error(errorMsg.notInitialized);
		}

		lcdLib.LogiLcdUpdate();
	}



	private _checkBitmap(bitmap: number[])
	{
		if (bitmap.length !== this.bitmapLength)
		{
			throw new Error(errorMsg.bitmapLength(this.bitmapLength));
		}
		else if (bitmap.some((byte) => (byte & 255) !== byte))
		{
			throw new Error(errorMsg.bitmapRange);
		}
		else
		{
			return true;
		}
	}

	private _checkColors(red: number, green: number, blue: number)
	{
		if ((red & 255) !== red ||
			(green & 255) !== green ||
			(blue & 255) !== blue)
		{
			throw new Error(errorMsg.colorByte);
		}
		else
		{
			return true;
		}
	}

	private _checkLineNumber(lineNumber: number)
	{
		if (!Number.isInteger(lineNumber))
		{
			throw new Error(errorMsg.lineIdNotInteger);
		}
		else if (lineNumber < 0 || lineNumber > this._config.numberOfLines - 1)
		{
			throw new Error(errorMsg.lineId(lineNumber, this._config.numberOfLines));
		}
		else
		{
			return true;
		}
	}

	private _toGrayscaleAverage(red: number, green: number, blue: number, alpha = 255)
	{
		return (red + green + blue) / 3;
	}

	private _toGrayscaleLightness(red: number, green: number, blue: number, alpha = 255)
	{
		return (Math.max(red, green, blue) + Math.min(red, green, blue)) / 2;
	}

	private _toGrayscaleLuminosity(red: number, green: number, blue: number, alpha = 255)
	{
		return 0.21 * red + 0.72 * green + 0.07 * blue;
	}
}
