import * as lgsdk from '../index';


function exitHandler(options: { cleanup?: boolean; exit?: boolean }, error: any)
{
	if (options.cleanup)
	{
		console.log('clean');
		lgsdk.lcd.mono.shutdown();
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


var success = lgsdk.lcd.mono.init('Test');
console.log('success:', success);

var connected = lgsdk.lcd.mono.isConnected();
console.log('connected:', connected);

lgsdk.lcd.mono.setText(0, 'This is the first line of text...');
lgsdk.lcd.mono.setText(1, '');
lgsdk.lcd.mono.setText(2, '');
lgsdk.lcd.mono.setText(3, '');

// let bitmap: number[] = [];
// for (let i = 0; i < lgsdk.lcd.mono.BITMAP_LENGTH; i++)
// {
// 	bitmap[i] = lgsdk.lcd.mono.WHITE;
// }
// lgsdk.lcd.mono.setBackground(bitmap);
lgsdk.lcd.mono.update();

process.stdin.resume();
