import { getDestroyPromise } from '../error';
import { LogiApi } from '../logi-api';
import { LOGITECH_MAX_GKEYS, LOGITECH_MAX_M_STATES, LOGITECH_MAX_MOUSE_BUTTONS } from './constants';
import { GkeyCodeData } from './ffi-lib';
import {
    getKeyboardGkeyString,
    getMouseButtonString,
    init,
    isKeyboardGkeyPressed,
    isMouseButtonPressed,
    shutdown,
} from './functional-api';


// mouse button strings or g-key strings are also allowed (e.g., 'G4/M1' and 'Mouse Btn 8')
type EventType = 'keyDown' | 'keyUp' | 'mouse' | string;

interface ListenerFunction
{
	(eventData: GkeyCodeData): any;
}


export class LogiGkey extends LogiApi
{
	public static GKEY_LIST: number[] = Array.apply(null, Array(LOGITECH_MAX_GKEYS)).map((_, i) => i + 1);
	public static MOUSE_BUTTON_LIST: number[] = Array.apply(null, Array(LOGITECH_MAX_MOUSE_BUTTONS)).map((_, i) => i + 1);
	public static M_STATE_LIST: number[] = Array.apply(null, Array(LOGITECH_MAX_M_STATES)).map((_, i) => i + 1);



	private _eventListener: Record<string, ListenerFunction[]> = {};



	protected constructor()
	{
		super();
	}



	public static getInstance()
	{
		return super.getInstance(LogiGkey) as LogiGkey;
	}



	public addEventListener(type: EventType, listener: ListenerFunction)
	{
		if (!this._eventListener.hasOwnProperty(type))
		{
			this._eventListener[type] = [];
		}
		this._eventListener[type].push(listener);
	}

	public getKeyboardGkeyString(gkeyNumber: number, modeNumber: number): string
	{
		return getKeyboardGkeyString(gkeyNumber, modeNumber);
	}

	public getMouseButtonString(buttonNumber: number): string
	{
		return getMouseButtonString(buttonNumber);
	}

	public init()
	{
		super._init('G-key');

		const that = this;
		// always init with a callback
		init(function (gkeyCode, gkeyOrButtonString, context)
		{
			return that._callback(this, gkeyCode, gkeyOrButtonString, context);
		});

		getDestroyPromise().then(() => this.shutdown());
	}

	public isKeyboardGkeyPressed(gkeyNumber: number, modeNumber: number): boolean
	{
		return isKeyboardGkeyPressed(gkeyNumber, modeNumber);
	}

	public isMouseButtonPressed(buttonNumber: number): boolean
	{
		return isMouseButtonPressed(buttonNumber);
	}

	public removeAllEventListeners(type?: EventType)
	{
		if (type)
		{
			this._eventListener[type] = [];
		}
		else
		{
			this._eventListener = {};
		}
	}

	public removeEventListener(type: EventType, listener: ListenerFunction)
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



	private _callback(that: any, gkeyCode: GkeyCodeData, gkeyOrButtonString: string, context: any)
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
		// filter using the information in `gkeyCode` and trigger from the most general to the most specific event
		this._trigger(gkeyCode.keyDown ? 'keyDown' : 'keyUp', eventData);
		if (gkeyCode.mouse)
		{
			this._trigger('mouse', eventData);
		}
		// enable listening to just G1 or M1 to get notified when ever G1 (mode independent) or any G-key in a specific mode is triggered
		const parts = gkeyOrButtonString.split('/');
		if (parts.length > 0)
		{
			parts.forEach(part => this._trigger(part, eventData));
		}
		this._trigger(gkeyOrButtonString, eventData);
	}

	private _trigger(type: EventType, eventData: GkeyCodeData)
	{
		if (this._eventListener.hasOwnProperty(type))
		{
			this._eventListener[type].forEach(listener => listener(eventData));
		}
	}
}
