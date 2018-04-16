import * as tests from './lcd/logi-lcd';
import * as oldTests from './lcd/old-api';


function executeTest(description: string, fn: Function, time = 1e3)
{
	return new Promise<void>((resolve, reject) =>
	{
		console.log('[Test] ' + description);
		fn();

		setTimeout(() =>
		{
			resolve();
		}, time);
	});
}


async function runTests()
{
	console.log('Old API');
	console.log('===');

	await executeTest('normal text', oldTests.testText);
	await executeTest('random background', oldTests.testBackground);
	oldTests.shutdown();

	console.log('New API');
	console.log('===');

	await executeTest('normal text', tests.testText);
	await executeTest('white background', tests.testWhiteBackground);
	await executeTest('black background', tests.testBlackBackground);
	await executeTest('random background', tests.testRandomBackground);
	await executeTest('image', tests.testImageBackground);
	await executeTest('inverted image', tests.testInvertedImageBackground);

}

runTests()
	.then(() =>
	{
		console.log('All tests run without any errors.');
	})
	.catch((error) =>
	{
		console.log('error:', error);
	})
;
