import { runLcdTests } from './lcd';


(async function ()
{
	console.log('Lcd');
	console.log('===');

	await runLcdTests();
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
