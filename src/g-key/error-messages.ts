import { LOGITECH_MAX_GKEYS, LOGITECH_MAX_M_STATES, LOGITECH_MAX_MOUSE_BUTTONS } from './constants';


export const BUTTON_NUMBER_INVALID = `Mouse button number out of range (allowed values: 0-${LOGITECH_MAX_MOUSE_BUTTONS})`;
export const GKEY_NUMBER_INVALID = `G-Key number out of range (allowed values: 0-${LOGITECH_MAX_GKEYS})`;
export const MODE_NUMBER_INVALID = `Mode number out of range (allowed values: 1-${LOGITECH_MAX_M_STATES})`;
