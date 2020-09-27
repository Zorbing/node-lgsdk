import { executeTest } from '../test-helper';
// import * as tests from './logi-led';
import * as functionalTests from './functional-api';


export async function runLedTests()
{
	console.log('Functional API');
	console.log('---');

	await executeTest('getting the sdk version', functionalTests.testColor);
	functionalTests.shutdown();
}
