import { executeTest } from '../test-helper';
import * as tests from './logi-lcd';
import * as oldTests from './old-api';


export async function runLcdTests()
{
	console.log('Old API');
	console.log('---');

	await executeTest('normal text', oldTests.testText);
	await executeTest('random background', oldTests.testBackground);
	oldTests.shutdown();

	console.log('');
	console.log('New API');
	console.log('---');

	await executeTest('normal text', tests.testText);
	await executeTest('white background', tests.testWhiteBackground);
	await executeTest('black background', tests.testBlackBackground);
	await executeTest('random background', tests.testRandomBackground);
	await executeTest('image', tests.testImageBackground);
	await executeTest('inverted image', tests.testInvertedImageBackground);
}
