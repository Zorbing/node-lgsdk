import { executeTest } from '../test-helper';
import * as tests from './logi-lcd';
import * as functionalTests from './functional-api';


export async function runLcdTests()
{
	console.log('Functional API');
	console.log('---');

	await executeTest('normal text', functionalTests.testText);
	await executeTest('random background', functionalTests.testBackground);
	functionalTests.shutdown();

	console.log('');
	console.log('Object Oriented API');
	console.log('---');

	await executeTest('normal text', tests.testText);
	await executeTest('white background', tests.testWhiteBackground);
	await executeTest('black background', tests.testBlackBackground);
	await executeTest('random background', tests.testRandomBackground);
	await executeTest('image', tests.testImageBackground);
	await executeTest('inverted image', tests.testInvertedImageBackground);
}
