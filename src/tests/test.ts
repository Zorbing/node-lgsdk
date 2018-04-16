import * as tests from './lcd/logi-lcd';
import * as oldTests from './lcd/old-api';


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
		oldTests.testText();
		return delayPromise();
	})
	.then(() =>
	{
		oldTests.testBackground();
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
		tests.testWhiteBackground();
		return delayPromise();
	})
	.then(() =>
	{
		tests.testBlackBackground();
		return delayPromise();
	})
	.then(() =>
	{
		tests.testRandomBackground();
		return delayPromise();
	})
	.then(() =>
	{
		tests.testImageBackground();
		return delayPromise();
	})
	.then(() =>
	{
		tests.testInvertedImageBackground();
		return delayPromise();
	})
	.catch((error) =>
	{
		console.log('error:', error);
	})
;
