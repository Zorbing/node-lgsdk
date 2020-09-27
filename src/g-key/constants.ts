/**
 * @module node-lgsdk/g-key
 * @license
 * The MIT License (MIT)
 *
 * Copyright 2018 Martin Boekhoff
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * The maximum of all g-key numbers/ids.
 * If not using a callback, this value is used alongside {@link MAX_M_STATES} for checking the pressed states of all g-keys.
 */
export const MAX_GKEYS = 29;

/**
 * The maximum of all mouse button numbers/ids.
 * If not using a callback, this value is used for checking the pressed state of all mouse buttons.
 */
export const MAX_MOUSE_BUTTONS = 20;

/**
 * The maximumx of all mode numbers/ids.
 * If not using a callback, this value is used alongside {@link MAX_GKEYS} for checking the pressed state of all g-keys.
 */
export const MAX_M_STATES = 3;
