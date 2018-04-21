import { libPath } from '../path';
import * as ffi from 'ffi';
import * as wchar_t from 'ref-wchar';


const wchar_string = wchar_t.string;


export const ledLib = ffi.Library(libPath('led'), {
	'LogiLedInit': ['bool', []],

	'LogiLedGetSdkVersion': ['bool', ['int *'/*majorNum*/, 'int *'/*minorNum*/, 'int *'/*buildNum*/]],
	'LogiLedGetConfigOptionNumber': ['bool', [wchar_string/*const wchar_t *configPath*/, 'double *'/*defaultValue*/]],
	'LogiLedGetConfigOptionBool': ['bool', [wchar_string/*const wchar_t *configPath*/, 'bool *'/*defaultValue*/]],
	'LogiLedGetConfigOptionColor': ['bool', [wchar_string/*const wchar_t *configPath*/, 'int *'/*defaultRed*/, 'int *'/*defaultGreen*/, 'int *'/*defaultBlue*/]],
	'LogiLedGetConfigOptionKeyInput': ['bool', [wchar_string/*const wchar_t *configPath*/, wchar_string/*defaultValue*/, 'int'/*bufferSize*/]],
	'LogiLedSetConfigOptionLabel': ['bool', [wchar_string/*const wchar_t *configPath*/, wchar_string/*label*/]],

	// Generic functions => Apply to any device type.
	'LogiLedSetTargetDevice': ['bool', ['int'/*targetDevice*/]],
	'LogiLedSaveCurrentLighting': ['bool', []],
	'LogiLedSetLighting': ['bool', ['int'/*redPercentage*/, 'int'/*greenPercentage*/, 'int'/*bluePercentage*/]],
	'LogiLedRestoreLighting': ['bool', []],
	'LogiLedFlashLighting': ['bool', ['int'/*redPercentage*/, 'int'/*greenPercentage*/, 'int'/*bluePercentage*/, 'int'/*milliSecondsDuration*/, 'int'/*milliSecondsInterval*/]],
	'LogiLedPulseLighting': ['bool', ['int'/*redPercentage*/, 'int'/*greenPercentage*/, 'int'/*bluePercentage*/, 'int'/*milliSecondsDuration*/, 'int'/*milliSecondsInterval*/]],
	'LogiLedStopEffects': ['bool', []],

	// Per-key functions => only apply to LOGI_DEVICETYPE_PERKEY_RGB devices.
	'LogiLedSetLightingFromBitmap': ['bool', ['uchar *'/*unsigned char bitmap[]*/]],
	'LogiLedSetLightingForKeyWithScanCode': ['bool', ['int'/*keyCode*/, 'int'/*redPercentage*/, 'int'/*greenPercentage*/, 'int'/*bluePercentage*/]],
	'LogiLedSetLightingForKeyWithHidCode': ['bool', ['int'/*keyCode*/, 'int'/*redPercentage*/, 'int'/*greenPercentage*/, 'int'/*bluePercentage*/]],
	'LogiLedSetLightingForKeyWithQuartzCode': ['bool', ['int'/*keyCode*/, 'int'/*redPercentage*/, 'int'/*greenPercentage*/, 'int'/*bluePercentage*/]],
	'LogiLedSetLightingForKeyWithKeyName': ['bool', ['int'/*LogiLed::KeyName keyName*/, 'int'/*redPercentage*/, 'int'/*greenPercentage*/, 'int'/*bluePercentage*/]],
	'LogiLedSaveLightingForKey': ['bool', ['int'/*LogiLed::KeyName keyName*/]],
	'LogiLedRestoreLightingForKey': ['bool', ['int'/*LogiLed::KeyName keyName*/]],
	'LogiLedExcludeKeysFromBitmap': ['bool', ['int *'/*LogiLed::KeyName *keyList*/, 'int'/*listCount*/]],

	// Per-key effects => only apply to LOGI_DEVICETYPE_PERKEY_RGB devices.
	'LogiLedFlashSingleKey': ['bool', ['int'/*LogiLed::KeyName keyName*/, 'int'/*redPercentage*/, 'int'/*greenPercentage*/, 'int'/*bluePercentage*/, 'int'/*msDuration*/, 'int'/*msInterval*/]],
	'LogiLedPulseSingleKey': ['bool', ['int'/*LogiLed::KeyName keyName*/, 'int'/*startRedPercentage*/, 'int'/*startGreenPercentage*/, 'int'/*startBluePercentage*/, 'int'/*finishRedPercentage*/, 'int'/*finishGreenPercentage*/, 'int'/*finishBluePercentage*/, 'int'/*msDuration*/, 'bool'/*isInfinite*/]],
	'LogiLedStopEffectsOnKey': ['bool', ['int'/*LogiLed::KeyName keyName*/]],

	'LogiLedShutdown': ['void', []],
});
