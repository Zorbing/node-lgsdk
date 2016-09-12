import libPath from './path';
import * as ffi from 'ffi';
import * as ref from 'ref';
import * as ArrayType from 'ref-array';
import * as wchar_t from 'ref-wchar';

var byte = ref.types.uchar;
var byteArray = ArrayType<number>(byte);
var wchar_string = wchar_t.string;


const LOGI_LCD_TYPE_MONO  = 0x00000001;
const LOGI_LCD_TYPE_COLOR = 0x00000002;

const LOGI_LCD_MONO_BUTTON_0 = 0x00000001;
const LOGI_LCD_MONO_BUTTON_1 = 0x00000002;
const LOGI_LCD_MONO_BUTTON_2 = 0x00000004;
const LOGI_LCD_MONO_BUTTON_3 = 0x00000008;

const LOGI_LCD_COLOR_BUTTON_LEFT	= 0x00000100;
const LOGI_LCD_COLOR_BUTTON_RIGHT	= 0x00000200;
const LOGI_LCD_COLOR_BUTTON_OK		= 0x00000400;
const LOGI_LCD_COLOR_BUTTON_CANCEL	= 0x00000800;
const LOGI_LCD_COLOR_BUTTON_UP		= 0x00001000;
const LOGI_LCD_COLOR_BUTTON_DOWN	= 0x00002000;
const LOGI_LCD_COLOR_BUTTON_MENU	= 0x00004000;

const LOGI_LCD_MONO_WIDTH = 160;
const LOGI_LCD_MONO_HEIGHT = 43;

const LOGI_LCD_COLOR_WIDTH = 320;
const LOGI_LCD_COLOR_HEIGHT = 240;

var lcdLib = ffi.Library(libPath('lcd'), {
	  'LogiLcdInit': ['bool', [wchar_string /*friendlyName*/, 'int' /*lcdType*/]]
	, 'LogiLcdIsConnected': ['bool', ['int' /*lcdType*/]]
	, 'LogiLcdIsButtonPressed': ['bool', ['int' /*button*/]]
	, 'LogiLcdUpdate': ['void', []]
	, 'LogiLcdShutdown': ['void', []]
	
	// Monochrome LCD functions
	, 'LogiLcdMonoSetBackground': ['bool', [byteArray /*monoBitmap[]*/]]
	, 'LogiLcdMonoSetText': ['bool', ['int' /*lineNumber*/, wchar_string /*text*/]]
	
	// Color LCD functions
	, 'LogiLcdColorSetBackground': ['bool', [byteArray /*colorBitmap[]*/]]
	, 'LogiLcdColorSetTitle': ['bool', [wchar_string /*text*/, 'int' /*red = 255*/, 'int' /*green = 255*/, 'int' /*blue = 255*/]]
	, 'LogiLcdColorSetText': ['bool', ['int' /*lineNumber*/, wchar_string /*text*/, 'int' /*red = 255*/, 'int' /*green = 255*/, 'int' /*blue = 255*/]]
});

const BUTTON_ERROR = 'The given button does not exist.';
const BITMAP_ERROR_LENGTH = (num) => `The bitmap must contain ${num} elements`;
const BITMAP_ERROR_RANGE = 'The bitmap must contain only bytes. Allowed values are: 0-255';
const COLOR_ERROR = 'Each color must be a byte (allowed values: 0-255)';
const LINE_ERROR = (num, max) => `Not allowed value "${num}" for line number. Allowed values are: 0-${max}`;

export module mono
{
	export const TYPE = LOGI_LCD_TYPE_MONO;
	export const BUTTON_0 = LOGI_LCD_MONO_BUTTON_0;
	export const BUTTON_1 = LOGI_LCD_MONO_BUTTON_1;
	export const BUTTON_2 = LOGI_LCD_MONO_BUTTON_2;
	export const BUTTON_3 = LOGI_LCD_MONO_BUTTON_3;
	export const WIDTH = LOGI_LCD_MONO_WIDTH;
	export const HEIGHT = LOGI_LCD_MONO_HEIGHT;
	export const BITMAP_LENGTH = WIDTH * HEIGHT;
	export const WHITE = 0;
	export const BLACK = 255;
	
	export function init(name: string): boolean
	{
		return lcdLib.LogiLcdInit(name, TYPE);
	}
	
	export function isConnected(): boolean
	{
		return lcdLib.LogiLcdIsConnected(TYPE);
	}
	
	export function isButtonPressed(button: number): boolean
	{
		if (button !== BUTTON_0 && button !== BUTTON_1 &&
			button !== BUTTON_2 && button !== BUTTON_3)
		{
			throw new Error(BUTTON_ERROR);
		}
		
		return lcdLib.LogiLcdIsButtonPressed(button);
	}
	export function update(): void
	{
		return lcdLib.LogiLcdUpdate();
	}
	export function shutdown(): void
	{
		return lcdLib.LogiLcdShutdown();
	}
	
	export function setBackground(bitmap: number[]): boolean
	{
		if (bitmap.length !== BITMAP_LENGTH)
		{
			throw new Error(BITMAP_ERROR_LENGTH(BITMAP_LENGTH));
		}
		if (bitmap.some((byte) => (byte & 255) !== byte))
		{
			throw new Error(BITMAP_ERROR_RANGE);
		}
		
		return lcdLib.LogiLcdMonoSetBackground(bitmap);
	}
	export function setText(lineNumber: number, text: string): boolean
	{
		// TODO: check if lineNumber is an integer
		if (lineNumber < 0 || lineNumber > 3)
		{
			throw new Error(LINE_ERROR(lineNumber, 4));
		}
		
		return lcdLib.LogiLcdMonoSetText(lineNumber, text);
	}
}

export module color
{
	export const TYPE = LOGI_LCD_TYPE_COLOR;
	export const BUTTON_LEFT = LOGI_LCD_COLOR_BUTTON_LEFT;
	export const BUTTON_RIGHT = LOGI_LCD_COLOR_BUTTON_RIGHT;
	export const BUTTON_OK = LOGI_LCD_COLOR_BUTTON_OK;
	export const BUTTON_CANCEL = LOGI_LCD_COLOR_BUTTON_CANCEL;
	export const BUTTON_UP = LOGI_LCD_COLOR_BUTTON_UP;
	export const BUTTON_DOWN = LOGI_LCD_COLOR_BUTTON_DOWN;
	export const BUTTON_MENU = LOGI_LCD_COLOR_BUTTON_MENU;
	export const WIDTH = LOGI_LCD_COLOR_WIDTH;
	export const HEIGHT = LOGI_LCD_COLOR_HEIGHT;
	export const BITMAP_LENGTH = WIDTH * HEIGHT * 4;
	
	export function init(name: string): boolean
	{
		return lcdLib.LogiLcdInit(name, TYPE);
	}
	
	export function isConnected(): boolean
	{
		return lcdLib.LogiLcdIsConnected(TYPE);
	}
	
	export function isButtonPressed(button: number): boolean
	{
		if (button !== BUTTON_LEFT && button !== BUTTON_RIGHT &&
			button !== BUTTON_UP && button !== BUTTON_DOWN &&
			button !== BUTTON_OK && button !== BUTTON_CANCEL &&
			button !== BUTTON_MENU)
		{
			throw new Error(BUTTON_ERROR);
		}
		
		return lcdLib.LogiLcdIsButtonPressed(button);
	}
	export function update(): void
	{
		return lcdLib.LogiLcdUpdate();
	}
	export function shutdown(): void
	{
		return lcdLib.LogiLcdShutdown();
	}
	
	export function setBackground(bitmap: number[]): boolean
	{
		if (bitmap.length !== BITMAP_LENGTH)
		{
			throw new Error(BITMAP_ERROR_LENGTH(BITMAP_LENGTH));
		}
		if (bitmap.some((byte) => (byte & 255) !== byte))
		{
			throw new Error(BITMAP_ERROR_RANGE);
		}
		
		return lcdLib.LogiLcdColorSetBackground(bitmap);
	}
	export function setTitle(text: string, red = 255, green = 255, blue = 255): boolean
	{
		if ((red & 255) !== red ||
			(green & 255) !== green ||
			(blue & 255) !== blue)
		{
			throw new Error(COLOR_ERROR);
		}
		return lcdLib.LogiLcdColorSetTitle(text, red, green, blue);
	}
	export function setText(lineNumber: number, text: string, red = 255, green = 255, blue = 255): boolean
	{
		if (lineNumber < 0 || lineNumber > 7)
		{
			throw new Error(LINE_ERROR(lineNumber, 7));
		}
		if ((red & 255) !== red ||
			(green & 255) !== green ||
			(blue & 255) !== blue)
		{
			throw new Error(COLOR_ERROR);
		}
		
		return lcdLib.LogiLcdColorSetText(lineNumber, text, red, green, blue);
	}
}
