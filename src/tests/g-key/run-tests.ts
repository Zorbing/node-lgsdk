import { executeTest } from '../test-helper';
import * as oldTests from './old-api';


export async function runGkeyTests()
{
	console.log('Old API');
	console.log('---');

	await executeTest('pressed keys', () => oldTests.testPressedKeys(10e3));
	oldTests.shutdown();
}
