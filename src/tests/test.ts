import { runGkeyTests } from './g-key';
import { runLcdTests } from './lcd';
import { runLedTests } from './led';


(async function ()
{
	console.log('Lcd');
	console.log('===');

	await runLcdTests();

	console.log('');
	console.log('');
	console.log('G-key');
	console.log('===');

	await runGkeyTests();

	console.log('');
	console.log('');
	console.log('Led');
	console.log('===');

	await runLedTests();
})()
	.then(() =>
	{
		console.log('All tests run without any errors.');
	})
	.catch((error) =>
	{
		console.log('error:', error);
	})
;
