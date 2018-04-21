import { executeTest } from '../test-helper';
// import * as tests from './logi-led';
import * as oldTests from './old-api';


export async function runLedTests()
{
	console.log('Old API');
	console.log('---');

	await executeTest('getting the sdk version', oldTests.testColor, 10e3);
	oldTests.shutdown();
}
