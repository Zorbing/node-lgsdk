export const errorMsg = {
	alreadyInitialized: 'The LCD-connection is already established.',
	bitmapLength: (num) => `The bitmap must contain ${num} elements`,
	bitmapRange: 'The bitmap must contain only bytes. Allowed values are: 0-255',
	buttonId: 'The given button does not exist.',
	colorByte: 'Each color must be a byte (allowed values: 0-255)',
	lineId: (num, max) => `Not allowed value "${num}" for line number. Allowed values are: 0-${max}`,
	lineIdNotInteger: 'The line number must be an integer.',
	notInitialized: 'The LCD-connection is not yet initialized. Please call `init`.',
};

export function addDestroyHandler(handler: Function)
{
	function exitHandler(options: { cleanup?: boolean; exit?: boolean }, error: any)
	{
		if (options.cleanup)
		{
			handler();
		}
		if (error)
		{
			console.log(error.stack);
		}
		if (options.exit)
		{
			process.exit();
		}
	}

	// do something when app is closing
	process.on('exit', exitHandler.bind(null, { cleanup: true }));
	// catch ctrl+c event
	process.on('SIGINT', exitHandler.bind(null, { exit: true }));
	// catch uncaught exceptions
	process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
}
