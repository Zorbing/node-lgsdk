import { LcdConfig, LOGI_LCD } from './constants';
import { errorMsg, addDestroyHandler } from './error-messages';
import { lcdLib } from './ffi-instance';


export interface Color
{
	blue: number;
	green: number;
	red: number;
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
	private _initialized = false;



	public bitmapLength: number = 0;

	public get initialized()
	{
		return this._initialized;
	}

	public isColor = false;
	public name: string | null = null;



	private constructor()
	{
	}



	public static getInstance()
	{
		if (!this._instance)
		{
			this._instance = new LogiLcd();
		}
		return this._instance;
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
			this._config = this.isColor ? LOGI_LCD.color : LOGI_LCD.mono;
			this.bitmapLength = this._config.width * this._config.height * this._config.bitsPerPixel;
			this._buttonList = this.isColor ? LogiLcd.BUTTON_LIST_COLOR : LogiLcd.BUTTON_LIST_MONO;

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

	public prepareImage(buffer: Buffer)
	{
		const array = [...buffer];
		if (this.isColor)
		{
			return array;
		}
		else
		{
			const bitmap = new Array<number>(this.bitmapLength);
			for (let i = 0; i < this.bitmapLength * 4; i += 4)
			{
				// TODO: convert color information into black-and-white
				bitmap[i / 4] = array[i];
			}
			return bitmap;
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

	public setText(text: string | string[], lineNumber?: number, color?: Color): boolean
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
				result = result && this.setText(text[i], i, color);
			}
		}
		else if (lineNumber !== undefined && this._checkLineNumber(lineNumber))
		{
			if (this.isColor)
			{
				color = this._ensureColor(color);
				if (this._checkColor(color))
				{
					result = lcdLib.LogiLcdColorSetText(lineNumber, text, color.red, color.green, color.blue);
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

	public setTitle(text: string, color?: Color): boolean
	{
		if (!this.initialized)
		{
			throw new Error(errorMsg.notInitialized);
		}

		let result = false;
		if (this.isColor)
		{
			color = this._ensureColor(color);
			if (this._checkColor(color))
			{
				result = lcdLib.LogiLcdColorSetTitle(text, color.red, color.green, color.blue);
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

	private _checkColor(color: Color)
	{
		if ((color.red & 255) !== color.red ||
			(color.green & 255) !== color.green ||
			(color.blue & 255) !== color.blue)
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

	private _ensureColor(color?: Color)
	{
		if (color)
		{
			return color;
		}
		else
		{
			return {
				blue: 255,
				green: 255,
				red: 255,
			};
		}
	}
}
