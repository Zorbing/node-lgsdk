export function getDestroyPromise()
{
	return new Promise<void>((resolve, reject) =>
	{
		function exitHandler(options: { cleanup?: boolean; exit?: boolean }, error: any)
		{
			if (options.cleanup)
			{
				resolve();
			}
			if (error)
			{
				console.error('error:', error);
				reject(error);
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
	});
}
