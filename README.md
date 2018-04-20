# node-lgsdk

A node.js-wrapper for the [Logitech Gaming SDKs](http://gaming.logitech.com/en-us/developers).

It provides a wrapper for the Logitech Gamepanel SDK in node.js and is written in TypeScript.
The [Logitech Gaming Software (LGS)](http://support.logitech.com/en_us/software/lgs) is used and has to be installed.


## Roadmap

* Support Logitech LED Illumination SDK
* Support Logitech Arx Control SDK
* Support Logitech Steering Wheel SDK
* Documentation

## Example

```ts
import * as lgsdk from 'node-lgsdk';


let counter = 0;

const lcdInstance = lgsdk.LogiLcd.getInstance();
if (!lcdInstance.initialized)
{
	lcdInstance.init('Example');
}
function showCounter()
{
	lcdInstance.setText([
		'G-Key with even number press-',
		'ed ' + counter + ' times',
	]);
	lcdInstance.update();
}
showCounter();

const gkeyInstance = lgsdk.LogiGkey.getInstance();
if (!gkeyInstance.initialized)
{
	gkeyInstance.init();
}
gkeyInstance.addEventListener('keyDown', (event) =>
{
	if (event.keyIdx % 2 === 0)
	{
		counter++;
		showCounter();
	}
});

process.stdin.resume();
```
