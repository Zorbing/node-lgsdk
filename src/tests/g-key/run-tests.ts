/**
 * @license
 * The MIT License (MIT)
 *
 * Copyright 2018 Martin Boekhoff
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { executeTest } from '../test-helper';
import * as tests from './logi-g-key';
import * as functionalTests from './functional-api';


export async function runGkeyTests()
{
	console.log('Functional API');
	console.log('---');

	await executeTest('pressed keys', () => functionalTests.testPressedKeys(10e3));
	functionalTests.shutdown();
	await executeTest('init with callback', () => functionalTests.testCallback(10e3));
	functionalTests.shutdown();
	await executeTest('init with callback and context', () => functionalTests.testContext(10e3));
	functionalTests.shutdown();

	console.log('');
	console.log('Object Oriented API');
	console.log('---');

	await executeTest('pressed keys', () => tests.testPressedKeys(10e3));
	await executeTest('test general event listener', () => tests.testGeneralEventListener(10e3));
	await executeTest('test specific event listener', () => tests.testSpecificEventListener(10e3));
}
