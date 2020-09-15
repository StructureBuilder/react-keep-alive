export var warn = function () { return undefined; };
if (process.env.NODE_ENV !== 'production') {
    /**
     * Prints a warning in the console if it exists.
     *
     * @param {*} message
     */
    warn = function (message) {
        if (typeof console !== undefined && typeof console.error === 'function') {
            console.error(message);
        }
        else {
            throw new Error(message);
        }
    };
}
