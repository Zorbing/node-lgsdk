import { runGkeyTests } from './g-key';
import { runLcdTests } from './lcd';


(async function ()
{
	console.log('Lcd');
	console.log('===');

	await runLcdTests();

	console.log('');
	console.log('');
	console.log('G-key');
	console.log('===');

	const test = await runGkeyTests();
	console.log('result of function:', test);
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
