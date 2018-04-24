<a name="0.3.0"></a>
# [0.3.0](https://github.com/Zorbing/node-lgsdk/compare/v0.2.0...v0.3.0) (2018-04-20)


## Bug Fixes

* fix callback being garbage collected ([c43cd76](https://github.com/Zorbing/node-lgsdk/commit/c43cd76))
* fix parameters of init callback ([0cee1d3](https://github.com/Zorbing/node-lgsdk/commit/0cee1d3))


## Documentation

* update README and set package version to v0.3.0 ([4d35f02](https://github.com/Zorbing/node-lgsdk/commit/4d35f02))


## Code Refactoring

* minor change (remove `console.log`) ([aa101f5](https://github.com/Zorbing/node-lgsdk/commit/aa101f5))
* minor changes (tidy up g-key test) ([2a7ff67](https://github.com/Zorbing/node-lgsdk/commit/2a7ff67)) ([C](https://github.com/Zorbing/node-lgsdk/commit/C))ommits on Apr 19, 2018
* fix inverted condition for parameter checking in g-key code ([1643fa7](https://github.com/Zorbing/node-lgsdk/commit/1643fa7))
* split g-key code into multiple files ([42f74ec](https://github.com/Zorbing/node-lgsdk/commit/42f74ec))
* move function `getDestroyPromise` into own file ([d0de065](https://github.com/Zorbing/node-lgsdk/commit/d0de065))
* adjust g-key source files to new structure ([6d4d829](https://github.com/Zorbing/node-lgsdk/commit/6d4d829))
* fix case of g-key file ([6d1b8cb](https://github.com/Zorbing/node-lgsdk/commit/6d1b8cb))


## Tests

* fix typo in log of one test ([a45ee89](https://github.com/Zorbing/node-lgsdk/commit/a45ee89))
* add tests for new g-key api ([af3622f](https://github.com/Zorbing/node-lgsdk/commit/af3622f))
* fix tests of old api (calling shutdown every time) ([03080d7](https://github.com/Zorbing/node-lgsdk/commit/03080d7))
* extend test for key state polling ([75f41c4](https://github.com/Zorbing/node-lgsdk/commit/75f41c4))
* add manual test for init with callback and context ([f5e7eab](https://github.com/Zorbing/node-lgsdk/commit/f5e7eab))
* update g-key tests to run in test script ([a5899a5](https://github.com/Zorbing/node-lgsdk/commit/a5899a5))
* move lcd test related stuff into own folder in tests ([e83f59a](https://github.com/Zorbing/node-lgsdk/commit/e83f59a))
* add test file ([57fed4f](https://github.com/Zorbing/node-lgsdk/commit/57fed4f))


## Features

* add triggering more event types from one single event ([f3d03ad](https://github.com/Zorbing/node-lgsdk/commit/f3d03ad))
* add tidying up event listeners after each test ([1312cbc](https://github.com/Zorbing/node-lgsdk/commit/1312cbc))
* add calling shutdown on application exit in g-key class api ([583ee2f](https://github.com/Zorbing/node-lgsdk/commit/583ee2f))
* change g-key class api to make init after shutdown possible ([21adc2e](https://github.com/Zorbing/node-lgsdk/commit/21adc2e))
* add shutdown to g-key class api ([a4bb641](https://github.com/Zorbing/node-lgsdk/commit/a4bb641))
* add class based api for g-key ([2c1249f](https://github.com/Zorbing/node-lgsdk/commit/2c1249f))
* simulate calling g-key init with context ([3274e9e](https://github.com/Zorbing/node-lgsdk/commit/3274e9e))
* use zero-filling right shift instead of normal right shift ([36125ee](https://github.com/Zorbing/node-lgsdk/commit/36125ee))
* fix parsing type GkeyCode correctly ([ee31b92](https://github.com/Zorbing/node-lgsdk/commit/ee31b92)) ([C](https://github.com/Zorbing/node-lgsdk/commit/C))ommits on Apr 20, 2018
* add c++ header files for reference ([6d3d51d](https://github.com/Zorbing/node-lgsdk/commit/6d3d51d))
* add using a version for the g-key dll files as well ([d17ee30](https://github.com/Zorbing/node-lgsdk/commit/d17ee30))
* improve type checking with literal types ([2bce13c](https://github.com/Zorbing/node-lgsdk/commit/2bce13c))
* add wrapping callback for init ([b52ff46](https://github.com/Zorbing/node-lgsdk/commit/b52ff46))
* add validity check for parameter ([4ef4283](https://github.com/Zorbing/node-lgsdk/commit/4ef4283))
* add g-key dlls and node-api ([067cef7](https://github.com/Zorbing/node-lgsdk/commit/067cef7))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/Zorbing/node-lgsdk/compare/v0.1.0...v0.2.0) (2018-04-16)


## Bug Fixes

* fix integer issue after color conversion ([0e36806](https://github.com/Zorbing/node-lgsdk/commit/0e36806))
* fix setText on new api ([a8dfeb0](https://github.com/Zorbing/node-lgsdk/commit/a8dfeb0))


## Chores

* fix naming of npm scripts ([7a837ae](https://github.com/Zorbing/node-lgsdk/commit/7a837ae))
* update version to v0.2.0 ([3ecbe2a](https://github.com/Zorbing/node-lgsdk/commit/3ecbe2a))
* update dependencies (node to v8 and typescript to v2.8) ([720f456](https://github.com/Zorbing/node-lgsdk/commit/720f456))


## Documentation

* remove image loading feature from roadmap in README ([efdfe1c](https://github.com/Zorbing/node-lgsdk/commit/efdfe1c))
* add entry to roadmap in README ([07cff35](https://github.com/Zorbing/node-lgsdk/commit/07cff35))


## Code Refactoring

* tidy up typings (add @types/ffi to dependencies) ([edf3ffe](https://github.com/Zorbing/node-lgsdk/commit/edf3ffe))
* move files containing manual tests into own folder ([8be8548](https://github.com/Zorbing/node-lgsdk/commit/8be8548))
* move manual tests to ".spec" files ([37cf0a2](https://github.com/Zorbing/node-lgsdk/commit/37cf0a2))
* split code into multiple files ([b55160e](https://github.com/Zorbing/node-lgsdk/commit/b55160e))
* move lcd api into folder ([4c3114c](https://github.com/Zorbing/node-lgsdk/commit/4c3114c))


## Tests

* update tests to use colors black/white from LogiLcd instance ([144f3ed](https://github.com/Zorbing/node-lgsdk/commit/144f3ed))
* add manual tests for showing bitmaps on lcd ([9012068](https://github.com/Zorbing/node-lgsdk/commit/9012068))
* add test assets ([f03e051](https://github.com/Zorbing/node-lgsdk/commit/f03e051))
* add more tests for the new api ([6cab5ed](https://github.com/Zorbing/node-lgsdk/commit/6cab5ed))


## Features

* promisify application exit handler ([f0eefa4](https://github.com/Zorbing/node-lgsdk/commit/f0eefa4))
* add using a color conversion for black-and-white ([2a28034](https://github.com/Zorbing/node-lgsdk/commit/2a28034))
* add node package bmp-js ([2883bb2](https://github.com/Zorbing/node-lgsdk/commit/2883bb2))
* add passing the lcd type on init ([ef8536b](https://github.com/Zorbing/node-lgsdk/commit/ef8536b))
* add api version to dll names ([3173918](https://github.com/Zorbing/node-lgsdk/commit/3173918))
* add class for abstract lcd handling ([ab7a698](https://github.com/Zorbing/node-lgsdk/commit/ab7a698))
* add checking line number to be an integer ([bfac345](https://github.com/Zorbing/node-lgsdk/commit/bfac345))
* add more typings for package `ref-wchar` ([ece9d04](https://github.com/Zorbing/node-lgsdk/commit/ece9d04))



<a name="0.1.0"></a>
# 0.1.0 (2016-09-12)


## Features

* add api wrapper for lcd functions from dll


