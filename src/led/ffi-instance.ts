import { libPath } from '../path';
import * as ffi from 'ffi';

export const ledLib = ffi.Library(libPath('led'), {
});
