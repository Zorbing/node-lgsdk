/**
 * @module node-lgsdk
 * @license
 * The MIT License (MIT)
 *
 * Copyright 2018 Martin Boekhoff
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

 /**
  * Returns a promise for tidying up on application destroy.
  *
  * @private
  * @returns
  * A promise which resolves when the process exists either because the application is closing, `Ctrl+C` (or similar) has been pressed, or an uncaught exception occurred.
  */
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
