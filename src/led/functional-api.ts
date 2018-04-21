import * as ref from 'ref';
import * as wchar_t from 'ref-wchar';

import { KeyName as KeyNameEnum } from './constants';
import { errorMsg } from './error-messages';
import { isBitmapValid, ledLib } from './ffi-instance';


const wchar_string = wchar_t.string;


export const KeyName = KeyNameEnum;

export function init()
{
	return ledLib.LogiLedInit() as boolean;
}

export function getSdkVersion()
{
	const majorNum = ref.alloc('int');
	const minorNum = ref.alloc('int');
	const buildNum = ref.alloc('int');
	if (ledLib.LogiLedGetSdkVersion(majorNum, minorNum, buildNum))
	{
		return {
			major: majorNum.deref<number>(),
			minor: minorNum.deref<number>(),
			build: buildNum.deref<number>(),
			toString: function ()
			{
				return `${this.major}.${this.minor}.${this.build}`;
			}
		};
	}
	else
	{
		return null;
	}
}

export function getConfigOptionNumber(configPath: string, defaultValue?: number)
{
	const defaultValuePointer = ref.alloc('double', defaultValue);
	if (ledLib.LogiLedGetConfigOptionNumber(configPath, defaultValuePointer))
	{
		return defaultValuePointer.deref<number>();
	}
	else
	{
		return null;
	}
}

export function getConfigOptionBool(configPath: string, defaultValue?: boolean)
{
	const defaultValuePointer = ref.alloc('bool', defaultValue);
	if (ledLib.LogiLedGetConfigOptionBool(configPath, defaultValuePointer))
	{
		return defaultValuePointer.deref<boolean>();
	}
	else
	{
		return null;
	}
}

export function getConfigOptionColor(configPath: string, defaultRed?: number, defaultGreen?: number, defaultBlue?: number)
{
	const defaultRedPointer = ref.alloc('int', defaultRed);
	const defaultGreenPointer = ref.alloc('int', defaultGreen);
	const defaultBluePointer = ref.alloc('int', defaultBlue);
	if (ledLib.LogiLedGetConfigOptionColor(configPath, defaultRedPointer, defaultGreenPointer, defaultBluePointer))
	{
		return {
			red: defaultRedPointer.deref<number>(),
			green: defaultGreenPointer.deref<number>(),
			blue: defaultBluePointer.deref<number>(),
		};
	}
	else
	{
		return null;
	}
}

// TODO: is bufferSize really optional?
export function getConfigOptionKeyInput(configPath: string, defaultValue?: string, bufferSize?: number)
{
	const defaultValuePointer = ref.alloc(wchar_string, defaultValue);
	if (ledLib.LogiLedGetConfigOptionKeyInput(configPath, defaultValuePointer, bufferSize))
	{
		return defaultValuePointer.deref<string>();
	}
	else
	{
		return null;
	}
}

export function setConfigOptionLabel(configPath: string, label?: string)
{
	const labelPointer = ref.alloc(wchar_string, label);
	if (ledLib.LogiLedSetConfigOptionLabel(configPath, labelPointer))
	{
		return labelPointer.deref<string>();
	}
	else
	{
		return null;
	}
}

export function setTargetDevice(targetDevice: number)
{
	return ledLib.LogiLedSetTargetDevice(targetDevice) as boolean;
}

export function saveCurrentLighting()
{
	return ledLib.LogiLedSaveCurrentLighting() as boolean;
}

export function setLighting(redPercentage: number, greenPercentage: number, bluePercentage: number)
{
	return ledLib.LogiLedSetLighting(redPercentage, greenPercentage, bluePercentage) as boolean;
}

export function restoreLighting()
{
	return ledLib.LogiLedRestoreLighting() as boolean;
}

export function flashLighting(
	redPercentage: number,
	greenPercentage: number,
	bluePercentage: number,
	milliSecondsDuration: number,
	milliSecondsInterval: number
)
{
	return ledLib.LogiLedFlashLighting(
		redPercentage,
		greenPercentage,
		bluePercentage,
		milliSecondsDuration,
		milliSecondsInterval
	) as boolean;
}

export function pulseLighting(
	redPercentage: number,
	greenPercentage: number,
	bluePercentage: number,
	milliSecondsDuration: number,
	milliSecondsInterval: number
)
{
	return ledLib.LogiLedPulseLighting(
		redPercentage,
		greenPercentage,
		bluePercentage,
		milliSecondsDuration,
		milliSecondsInterval
	) as boolean;
}

export function stopEffects()
{
	return ledLib.LogiLedStopEffects() as boolean;
}

export function setLightingFromBitmap(bitmap: number[])
{
	if (!isBitmapValid(bitmap))
	{
		throw new Error(errorMsg.bitmapInvalid);
	}
	else
	{
		return ledLib.LogiLedSetLightingFromBitmap(bitmap) as boolean;
	}
}

export function setLightingForKeyWithScanCode(
	keyCode: number,
	redPercentage: number,
	greenPercentage: number,
	bluePercentage: number
)
{
	return ledLib.LogiLedSetLightingForKeyWithScanCode(
		keyCode,
		redPercentage,
		greenPercentage,
		bluePercentage
	) as boolean;
}

export function setLightingForKeyWithHidCode(
	keyCode: number,
	redPercentage: number,
	greenPercentage: number,
	bluePercentage: number
)
{
	return ledLib.LogiLedSetLightingForKeyWithHidCode(
		keyCode,
		redPercentage,
		greenPercentage,
		bluePercentage
	) as boolean;
}

export function setLightingForKeyWithQuartzCode(
	keyCode: number,
	redPercentage: number,
	greenPercentage: number,
	bluePercentage: number
)
{
	return ledLib.LogiLedSetLightingForKeyWithQuartzCode(
		keyCode,
		redPercentage,
		greenPercentage,
		bluePercentage
	) as boolean;
}

export function setLightingForKeyWithKeyName(
	keyName: KeyNameEnum,
	redPercentage: number,
	greenPercentage: number,
	bluePercentage: number
)
{
	return ledLib.LogiLedSetLightingForKeyWithKeyName(
		keyName,
		redPercentage,
		greenPercentage,
		bluePercentage
	) as boolean;
}

export function saveLightingForKey(keyName: KeyNameEnum)
{
	return ledLib.LogiLedSaveLightingForKey(keyName) as boolean;
}

export function restoreLightingForKey(keyName: KeyNameEnum)
{
	return ledLib.LogiLedRestoreLightingForKey() as boolean;
}

export function excludeKeysFromBitmap(keyList: KeyNameEnum[])
{
	return ledLib.LogiLedExcludeKeysFromBitmap(keyList, keyList.length) as boolean;
}

export function flashSingleKey(
	keyName: KeyNameEnum,
	redPercentage: number,
	greenPercentage: number,
	bluePercentage: number,
	msDuration: number,
	msInterval: number
)
{
	return ledLib.LogiLedFlashSingleKey(
		keyName,
		redPercentage,
		greenPercentage,
		bluePercentage,
		msDuration,
		msInterval
	) as boolean;
}

export function pulseSingleKey(
	keyName: KeyNameEnum,
	startRedPercentage: number,
	startGreenPercentage: number,
	startBluePercentage: number,
	finishRedPercentage: number,
	finishGreenPercentage: number,
	finishBluePercentage: number,
	msDuration: number,
	isInfinite: boolean
)
{
	return ledLib.LogiLedPulseSingleKey(
		keyName,
		startRedPercentage,
		startGreenPercentage,
		startBluePercentage,
		finishRedPercentage,
		finishGreenPercentage,
		finishBluePercentage,
		msDuration,
		isInfinite
	) as boolean;
}

export function stopEffectsOnKey(keyName: KeyNameEnum)
{
	return ledLib.LogiLedStopEffectsOnKey(keyName) as boolean;
}

export function shutdown()
{
	return ledLib.LogiLedShutdown() as void;
}
