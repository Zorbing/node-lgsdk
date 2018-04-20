import { executeTest } from '../test-helper';
import * as tests from './logi-g-key';
import * as functionalTests from './functional-api';


export async function runGkeyTests()
{
	console.log('Old API');
	console.log('---');

	await executeTest('pressed keys', () => functionalTests.testPressedKeys(10e3));
	functionalTests.shutdown();
	await executeTest('init with callback', () => functionalTests.testCallback(10e3));
	functionalTests.shutdown();
	await executeTest('init with callback and context', () => functionalTests.testContext(10e3));
	functionalTests.shutdown();

	console.log('');
	console.log('New API');
	console.log('---');

	await executeTest('pressed keys', () => tests.testPressedKeys(10e3));
	await executeTest('test general event listener', () => tests.testGeneralEventListener(10e3));
	await executeTest('test specific event listener', () => tests.testSpecificEventListener(10e3));
}
