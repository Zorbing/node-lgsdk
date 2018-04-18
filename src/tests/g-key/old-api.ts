import * as lgsdk from '../../index';

function exitHandler(options: { cleanup?: boolean; exit?: boolean }, error: any)
{
	if (options.cleanup)
	{
		console.log('shutting down...');
		lgsdk.gKey.shutdown();
	}
	if (error)
	{
		console.log(error.stack);
	}
	if (options.exit)
	{
		process.exit();
	}
}

// do something when app is closing
process.on('exit', exitHandler.bind(null,{ cleanup: true }));
// catch ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));
// catch uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));

lgsdk.gKey.init();
// lgsdk.gKey.init((gkeyCode, gkeyOrButtonString, context) =>
// {
// 	console.log('initiated:', gkeyCode, gkeyOrButtonString, context);
// });

let lastState = false;
setInterval(() =>
{
	let state = lgsdk.gKey.isKeyboardGkeyPressed(1, 1);
	if (state !== lastState)
	{
		lastState = state;
		console.log('changed state!', state);
	}
}, 100);

process.stdin.resume();
