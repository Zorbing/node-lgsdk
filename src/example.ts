import * as lgsdk from '.';


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
