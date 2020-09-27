import { led } from '../..';
import { getDestroyPromise } from '../../error';


let isRunning = false;
function init()
{
	const success = led.init();
	console.log('init success:', success);

	if (!isRunning)
	{
		isRunning = true;
		getDestroyPromise().then(() => shutdown());
	}
}

export function shutdown()
{
	if (isRunning)
	{
		console.log('shutting down old api');
		led.shutdown();
		isRunning = false;
	}
}

export function testColor()
{
	init();

	const sdkVersion = led.getSdkVersion();
	console.log('sdkVersion:', sdkVersion && sdkVersion.toString());
}
