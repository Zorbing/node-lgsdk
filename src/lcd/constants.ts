/**
 * Monochrome displays (resolution 160x43):
 *	- G510
 *	- G13
 *	- G15v1
 *	- G15v2
 *
 * Color displays (resoultion 320x240, full RGBA):
 *	- G19
 */

export interface LcdConfig
{
	buttons: Record<string, number>;
	bitsPerPixel: number;
	height: number;
	numberOfLines: number;
	type: number;
	width: number;
}

export const LOGI_LCD = {
	mono: {
		type:			0x00000001,
		buttons: {
			'0':		0x00000001,
			'1':		0x00000002,
			'2':		0x00000004,
			'3':		0x00000008,
		},
		width:			160,
		height:			43,
		numberOfLines:	4,
		bitsPerPixel:	1,
	} as LcdConfig,
	color: {
		type:			0x00000002,
		buttons: {
			'left':		0x00000100,
			'right':	0x00000200,
			'ok':		0x00000400,
			'cancel':	0x00000800,
			'up':		0x00001000,
			'down':		0x00002000,
			'menu':		0x00004000,
		},
		width:			320,
		height:			240,
		numberOfLines:	8,
		bitsPerPixel:	4,
	} as LcdConfig,
};

// blue, green, red, alpha
export const WHITE = [255, 255, 255, 255];
// blue, green, red, alpha
export const BLACK = [0, 0, 0, 255];
