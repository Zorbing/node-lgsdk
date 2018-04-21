import { executeTest } from '../test-helper';
// import * as tests from './logi-led';
import * as functionalTests from './functional-api';


export async function runLedTests()
{
	console.log('Old API');
	console.log('---');

	await executeTest('getting the sdk version', functionalTests.testColor);
	functionalTests.shutdown();
}
