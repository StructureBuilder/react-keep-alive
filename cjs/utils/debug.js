"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warn = void 0;
exports.warn = function () { return undefined; };
if (process.env.NODE_ENV !== 'production') {
    /**
     * Prints a warning in the console if it exists.
     *
     * @param {*} message
     */
    exports.warn = function (message) {
        if (typeof console !== undefined && typeof console.error === 'function') {
            console.error(message);
        }
        else {
            throw new Error(message);
        }
    };
}
