import { getDestroyPromise } from '../error';
import { LogiApi } from '../logi-api';
import { BLACK, LcdConfig, LOGI_LCD, WHITE } from './constants';
import { errorMsg } from './error-messages';
import {
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


export class LogiLcd extends LogiApi
{
	public static BUTTON_LIST_COLOR = Object.keys(LOGI_LCD.color.buttons)
		.map(buttonKey => LOGI_LCD.color.buttons[buttonKey])
	;
	public static BUTTON_LIST_MONO = Object.keys(LOGI_LCD.mono.buttons)
		.map(buttonKey => LOGI_LCD.mono.buttons[buttonKey])
	;



	private _autoUpdate = false;
	private _config: LcdConfig;
	private _color2Grayscale: Color2GrayscaleConversionFunction;



	public black: number[];
	public bitmapLength: number = 0;
	public isColor = false;
	public name: string | null = null;
	public white: number[];



	protected constructor()
	{
		super();

		this._toGrayscaleAverage = this._toGrayscaleAverage.bind(this);
		this._toGrayscaleLightness = this._toGrayscaleLightness.bind(this);
		this._toGrayscaleLuminosity = this._toGrayscaleLuminosity.bind(this);

		this.setGrayscaleConversion(COLOR_TO_GRAYSCALE_CONVERSION.luminosity);
	}



	public static getInstance()
	{
		return super.getInstance(LogiLcd) as LogiLcd;
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
		super._init('LCD');

		this.name = name;
		this._initialized = init(name, type);
		if (this.initialized)
		{
			this.isColor = this.isConnected(LOGI_LCD.color.type);
			if (this.isColor)
			{
				this._config = {
					...LOGI_LCD.color,
				};
				this.bitmapLength = this._config.width * this._config.height * 4;
				this.black = [...BLACK];
				this.white = [...WHITE];
			}
			else
			{
				this._config = {
					...LOGI_LCD.mono,
				};
				this.bitmapLength = this._config.width * this._config.height * 1;
				this.black = [this._color2Grayscale(BLACK[0], BLACK[1], BLACK[2], BLACK[3])];
				this.white = [this._color2Grayscale(WHITE[0], WHITE[1], WHITE[2], WHITE[3])];
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
				type = this.isColor ? LOGI_LCD.color.type : LOGI_LCD.mono.type;
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
		if (super._shutdown())
		{
			shutdown();
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



	private _toGrayscaleAverage(red: number, green: number, blue: number, alpha = 255)
	{
		return Math.round((red + green + blue) / 3);
	}

	private _toGrayscaleLightness(red: number, green: number, blue: number, alpha = 255)
	{
		return Math.round((Math.max(red, green, blue) + Math.min(red, green, blue)) / 2);
	}

	private _toGrayscaleLuminosity(red: number, green: number, blue: number, alpha = 255)
	{
		return Math.round(0.21 * red + 0.72 * green + 0.07 * blue);
	}
}
