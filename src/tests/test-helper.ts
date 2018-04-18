export function executeTest(description: string, fn: Function, time = 1e3)
{
	return new Promise<any>((resolve, reject) =>
	{
		console.log('[Test] ' + description);
		const result = fn();

		setTimeout(() =>
		{
			resolve(result);
		}, time);
	});
}
