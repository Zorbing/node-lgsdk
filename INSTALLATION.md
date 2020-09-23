# Installation


## Prerequisites

This package does not support other platforms besides __Windows__.
There seem to be unofficial drivers i.e. for [Linux](https://wiki.archlinux.org/index.php/Logitech_Gaming_Keyboards), but supporting those is not planned (even though PR are very welcome).

The [Logitech Gaming Software (LGS)](http://support.logitech.com/en_us/software/lgs) needs to be installed on your system.

Furthermore, this package was originally developed in node.js 8.9.4.
I recommend using the [node version manager](https://github.com/coreybutler/nvm-windows) to switch between node 8 and later versions:
```cmd
nvm install 8.9.4
nvm use 8.9.4
```

### FFI, node-gyp and Python

One of the dependencies of this package is the foreign function interface package ([ffi](https://github.com/node-ffi/node-ffi)).
To install this dependency, [node-gyp](https://github.com/nodejs/node-gyp) might be required.
The instructions for installing node-gyp can also be found in their [documentation](https://github.com/nodejs/node-gyp#on-windows), but in the following I will give a summary of the steps required to set everything up.

__Note:__ *When using nvm, the globally installed dependencies (like node-gyp or windows-build-tools) have to be installed for each version separately.*

I recommend setting up [pyenv](https://github.com/pyenv-win/pyenv-win) to manage different versions of Python.
This lets you install the latest Python version (3.8.5 at the time of writing: 2020-09-23) and activate it like this:
```cmd
pyenv install 3.8.5
pyenv global 3.8.5
```

Microsoft's [windows-build-tools](https://github.com/felixrieseberg/windows-build-tools) bundles all the software necessary for node-gyp.
Install it in an elevated cmd or powershell like this:
```cmd
npm install --global --production windows-build-tools
```

Lastly, install node-gyp:
```cmd
npm install --global node-gyp
```


## Building the package

Install the package's dependencies:
```cmd
npm install
```

TODO...
