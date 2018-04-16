import * as tests from './lcd/logi-lcd.spec';
import * as oldTests from './lcd/old-api.spec';


function delayPromise(time: number = 1e3)
{
	return new Promise<void>((resolve, reject) =>
	{
		setTimeout(() =>
		{
			resolve();
		}, time);
	});
}

delayPromise(0)
	.then(() =>
	{
		oldTests.testTextOld();
		return delayPromise();
	})
	.then(() =>
	{
		oldTests.shutdown();

		oldTests.testBackgroundOld();
		return delayPromise();
	})
	.then(() =>
	{
		oldTests.shutdown();

		tests.testText();
		return delayPromise();
	})
	.then(() =>
	{
		tests.testBackground();
		return delayPromise();
	})
;
