import { executeTest } from '../test-helper';
import * as tests from './logi-g-key';
import * as oldTests from './old-api';


export async function runGkeyTests()
{
	console.log('Old API');
	console.log('---');

	await executeTest('pressed keys', () => oldTests.testPressedKeys(10e3));
	oldTests.shutdown();
	await executeTest('init with callback', () => oldTests.testCallback(10e3));
	oldTests.shutdown();
	await executeTest('init with callback and context', () => oldTests.testContext(10e3));
	oldTests.shutdown();

	console.log('');
	console.log('New API');
	console.log('---');

	await executeTest('pressed keys', () => tests.testPressedKeys(10e3));
	await executeTest('test general event listener', () => tests.testGeneralEventListener(10e3));
	await executeTest('test specific event listener', () => tests.testSpecificEventListener(10e3));
}
