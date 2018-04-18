// Type definitions for bmp-js@0.0.3
// Project: https://github.com/shaozilee/bmp-js
// Definitions by: Martin Boekhoff <https://github.com/Zorbing>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript version: 2.8

declare module 'bmp-js'
{
	interface ImageData
	{
		data: Buffer;
		height: number;
		width: number;
	}
	interface EncoderImageData extends ImageData
	{
		rgb: boolean;
	}

	export function decode(bmpData: Buffer): ImageData;
	export function encode(imgData: EncoderImageData, quality: number): ImageData;
}
