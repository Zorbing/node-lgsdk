function isPromise<T = any>(obj: any): obj is Promise<T>
{
	return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

export function executeTest(description: string, fn: Function, time = 1e3)
{
	return new Promise<any>((resolve, reject) =>
	{
		console.log('[Test] ' + description);
		const result = fn();

		if (isPromise(result))
		{
			result.then(resolve, reject);
		}
		else
		{
			setTimeout(() =>
			{
				resolve(result);
			}, time);
		}
	});
}
