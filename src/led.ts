import libPath from './path';
import * as ffi from 'ffi';

var ledLib = ffi.Library(libPath('led'), {
});

ledLib;

export module empty
{
}
