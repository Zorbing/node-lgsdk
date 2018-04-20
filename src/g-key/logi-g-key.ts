import { getDestroyPromise } from '../error';
import { LOGITECH_MAX_GKEYS, LOGITECH_MAX_M_STATES, LOGITECH_MAX_MOUSE_BUTTONS } from './constants';
import { errorMsg } from './error-messages';
import { createInitCallback, GkeyCode, gkeyLib } from './ffi-instance';


// mouse button strings or g-key strings are also allowed (e.g., 'G4/M1' and 'Mouse Btn 8')
type EventType = 'keyDown' | 'keyUp' | 'mouse' | string;


export class LogiGkey
{
	private static _instance: LogiGkey | null = null;



	public static GKEY_LIST: number[] = Array.apply(null, Array(LOGITECH_MAX_GKEYS)).map((_, i) => i + 1);
	public static MOUSE_BUTTON_LIST: number[] = Array.apply(null, Array(LOGITECH_MAX_MOUSE_BUTTONS)).map((_, i) => i + 1);
	public static M_STATE_LIST: number[] = Array.apply(null, Array(LOGITECH_MAX_M_STATES)).map((_, i) => i + 1);



	private _eventListener: Record<string, Function[]> = {};
	private _ffiCallback: Buffer | null = null;
	private _initialized = false;



	public get initialized()
	{
		return this._initialized;
	}



	private constructor()
	{
	}



	public static getInstance()
	{
		if (!this._instance)
		{
			this._instance = new LogiGkey();
		}
		return this._instance;
	}



	public addEventListener(type: EventType, listener: Function)
	{
		if (!this._eventListener.hasOwnProperty(type))
		{
			this._eventListener[type] = [];
		}
		this._eventListener[type].push(listener);
	}

	public getKeyboardGkeyString(gkeyNumber: number, modeNumber: number): string
	{
		this._checkGkeyNumber(gkeyNumber);
		this._checkModeNumber(modeNumber);

		return gkeyLib.LogiGkeyGetKeyboardGkeyString(gkeyNumber, modeNumber);
	}

	public getMouseButtonString(buttonNumber: number): string
	{
		this._checkButtonNumber(buttonNumber);

		return gkeyLib.LogiGkeyGetMouseButtonString(buttonNumber);
	}

	public init()
	{
		if (this.initialized)
		{
			throw new Error(errorMsg.alreadyInitialized);
		}

		// store the callback to keep it from being garbage collected
		const that = this;
		this._ffiCallback = createInitCallback(function (gkeyCode, gkeyOrButtonString, context)
		{
			return that._callback(this, gkeyCode, gkeyOrButtonString, context);
		});
		// always init with a callback
		this._initialized = gkeyLib.LogiGkeyInitWithoutContext(this._ffiCallback);

		getDestroyPromise().then(() => this.shutdown());
	}

	public isKeyboardGkeyPressed(gkeyNumber: number, modeNumber: number): boolean
	{
		this._checkGkeyNumber(gkeyNumber);
		this._checkModeNumber(modeNumber);

		return gkeyLib.LogiGkeyIsKeyboardGkeyPressed(gkeyNumber, modeNumber);
	}

	public isMouseButtonPressed(buttonNumber: number): boolean
	{
		this._checkButtonNumber(buttonNumber);

		return gkeyLib.LogiGkeyIsMouseButtonPressed(buttonNumber);
	}

	public removeEventListener(type: EventType, listener: Function)
	{
		if (!this._eventListener.hasOwnProperty(type))
		{
			return false;
		}
		else
		{
			// remove all listener references from the array of that type
			let index = 0;
			let found = false;
			do
			{
				index = this._eventListener[type].indexOf(listener, index);
				if (index !== -1)
				{
					this._eventListener[type].splice(index, 1);
					found = true;
				}
			}
			while (index !== -1);
			return found;
		}
	}

	public shutdown()
	{
		if (this.initialized)
		{
			console.log('shutting down new api');
			gkeyLib.LogiLcdShutdown();
			this._initialized = false;
			// free the callback buffer for being garbage collected
			this._ffiCallback = null;
			return true;
		}
		else
		{
			return false;
		}
	}



	private _callback(that: any, gkeyCode: GkeyCode, gkeyOrButtonString: string, context: any)
	{
		// create a copy of the object with only a selection of its properties
		const eventData = {
			'keyDown': gkeyCode['keyDown'],
			'keyIdx': gkeyCode['keyIdx'],
			'mouse': gkeyCode['mouse'],
			'mState': gkeyCode['mState'],
			'reserved1': gkeyCode['reserved1'],
			'reserved2': gkeyCode['reserved2'],
		};
		// filter using the information in `gkeyCode`
		this._trigger(gkeyCode.keyDown ? 'keyDown' : 'keyUp', eventData);
		this._trigger(gkeyOrButtonString, eventData);
	}

	private _checkButtonNumber(buttonNumber: number)
	{
		if (LogiGkey.MOUSE_BUTTON_LIST.indexOf(buttonNumber) === -1)
		{
			throw new Error(errorMsg.buttonNumberInvalid(LOGITECH_MAX_MOUSE_BUTTONS));
		}
	}

	private _checkGkeyNumber(gkeyNumber: number)
	{
		if (LogiGkey.GKEY_LIST.indexOf(gkeyNumber) === -1)
		{
			throw new Error(errorMsg.gkeyNumberInvalid(LOGITECH_MAX_GKEYS));
		}
	}

	private _checkModeNumber(modeNumber: number)
	{
		if (LogiGkey.M_STATE_LIST.indexOf(modeNumber) === -1)
		{
			throw new Error(errorMsg.modeNumberInvalid(LOGITECH_MAX_M_STATES));
		}
	}

	private _trigger(type: EventType, eventData: GkeyCode)
	{
		if (this._eventListener.hasOwnProperty(type))
		{
			this._eventListener[type].forEach(listener => listener(eventData));
		}
	}
}
