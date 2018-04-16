// Type definitions for bmp-js
// Project: https://github.com/shaozilee/bmp-js
// Definitions by: Martin Boekhoff <https://github.com/Zorbing>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

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
