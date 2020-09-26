export const getDestroyPromise = (() =>
{
	const promiseList: { resolve: (value?: void | PromiseLike<void> | undefined) => void, reject: (reason?: any) => void }[] = [];
	function exitHandler(options: { cleanup?: boolean; exit?: boolean }, error: any)
	{
		if (options.cleanup)
		{
			promiseList.forEach(promise => promise.resolve());
		}
		if (error)
		{
			console.error('error:', error);
			promiseList.forEach(promise => promise.reject(error));
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

	return function ()
	{
		return new Promise<void>((resolve, reject) =>
		{
			promiseList.push({ resolve, reject });
		});
	};
})();
