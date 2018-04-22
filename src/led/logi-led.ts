import { LogiApi } from '../logi-api';
import { KeyName } from './constants';
import {
    excludeKeysFromBitmap,
    flashLighting,
    flashSingleKey,
    getConfigOptionBool,
    getConfigOptionColor,
    getConfigOptionKeyInput,
    getConfigOptionNumber,
    getSdkVersion,
    init,
    pulseLighting,
    pulseSingleKey,
    restoreLighting,
    restoreLightingForKey,
    saveCurrentLighting,
    saveLightingForKey,
    setConfigOptionLabel,
    setLighting,
    setLightingForKeyWithHidCode,
    setLightingForKeyWithKeyName,
    setLightingForKeyWithQuartzCode,
    setLightingForKeyWithScanCode,
    setLightingFromBitmap,
    setTargetDevice,
    shutdown,
    stopEffects,
    stopEffectsOnKey,
} from './functional-api';


export class Color
{
	constructor(
		public red: number,
		public green: number,
		public blue: number
	)
	{
	}
}


export class LogiLedConfig
{
	public getBool(configPath: string | string[], defaultValue?: boolean)
	{
		return getConfigOptionBool(this._configPath2String(configPath), defaultValue);
	}

	public getColor(configPath: string | string[], defaultColor?: Color)
	{
		return getConfigOptionColor(
			this._configPath2String(configPath),
			defaultColor && defaultColor.red,
			defaultColor && defaultColor.green,
			defaultColor && defaultColor.blue
		);
	}

	public getKeyInput(configPath: string | string[], defaultValue?: string, bufferSize?: number)
	{
		return getConfigOptionKeyInput(this._configPath2String(configPath), defaultValue, bufferSize);
	}

	public getNumber(configPath: string | string[], defaultValue?: number)
	{
		return getConfigOptionNumber(this._configPath2String(configPath), defaultValue);
	}

	public setLabel(configPath: string | string[], label?: string)
	{
		return setConfigOptionLabel(this._configPath2String(configPath), label);
	}



	private _configPath2String(configPath: string | string[])
	{
		return configPath instanceof Array ? configPath.join('/') : configPath;
	}
}


export class LogiLed extends LogiApi
{
	public config: LogiLedConfig;
	public KeyName = KeyName;



	protected constructor()
	{
		super();
	}



	public static getInstance()
	{
		return super.getInstance(LogiLed) as LogiLed;
	}



	public excludeKeysFromBitmap(keyList: KeyName[])
	{
		return excludeKeysFromBitmap(keyList);
	}

	public flashLighting(percentage: Color, msDuration: number, msInterval: number)
	{
		return flashLighting(
			percentage.red,
			percentage.green,
			percentage.blue,
			msDuration,
			msInterval
		);
	}

	public flashSingleKey(keyName: KeyName, percentage: Color, msDuration: number, msInterval: number)
	{
		return flashSingleKey(
			keyName,
			percentage.red,
			percentage.green,
			percentage.blue,
			msDuration,
			msInterval
		);
	}

	public getSdkVersion()
	{
		return getSdkVersion();
	}

	public init()
	{
		super._init('LED');

		return init();
	}

	public loadConfig(config: Record<string, boolean | number | string>)
	{
		console.log('config:', config);
	}

	public pulseLighting(percentage: Color, msDuration: number, msInterval: number)
	{
		return pulseLighting(
			percentage.red,
			percentage.green,
			percentage.blue,
			msDuration,
			msInterval
		);
	}

	public pulseSingleKey(
		keyName: KeyName,
		startPercentage: Color,
		finishPercentage: Color,
		msDuration: number,
		isInfinite: boolean
	)
	{
		return pulseSingleKey(
			keyName,
			startPercentage.red,
			startPercentage.green,
			startPercentage.blue,
			finishPercentage.red,
			finishPercentage.green,
			finishPercentage.blue,
			msDuration,
			isInfinite
		);
	}

	public restoreLighting()
	{
		return restoreLighting();
	}

	public restoreLightingForKey(keyName: KeyName)
	{
		return restoreLightingForKey(keyName);
	}

	public saveCurrentLighting()
	{
		return saveCurrentLighting();
	}

	public saveLightingForKey(keyName: KeyName)
	{
		return saveLightingForKey(keyName);
	}

	public setLighting(percentage: Color)
	{
		return setLighting(percentage.red, percentage.green, percentage.blue);
	}

	public setLightingForKeyWithHidCode(keyCode: number,percentage: Color)
	{
		return setLightingForKeyWithHidCode(
			keyCode,
			percentage.red,
			percentage.green,
			percentage.blue
		);
	}

	public setLightingForKeyWithKeyName(keyName: KeyName, percentage: Color)
	{
		return setLightingForKeyWithKeyName(
			keyName,
			percentage.red,
			percentage.green,
			percentage.blue
		);
	}

	public setLightingForKeyWithQuartzCode(keyCode: number, percentage: Color)
	{
		return setLightingForKeyWithQuartzCode(
			keyCode,
			percentage.red,
			percentage.green,
			percentage.blue
		);
	}

	public setLightingForKeyWithScanCode(keyCode: number, percentage: Color)
	{
		return setLightingForKeyWithScanCode(
			keyCode,
			percentage.red,
			percentage.green,
			percentage.blue
		);
	}

	public setLightingFromBitmap(bitmap: number[])
	{
		return setLightingFromBitmap(bitmap);
	}

	public setTargetDevice(targetDevice: number)
	{
		return setTargetDevice(targetDevice);
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

	public stopEffects()
	{
		return stopEffects();
	}

	public stopEffectsOnKey(keyName: KeyName)
	{
		return stopEffectsOnKey(keyName);
	}
}
