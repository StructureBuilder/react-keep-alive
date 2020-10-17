"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prefix = void 0;
var hexDigits = '0123456789abcdef';
exports.prefix = 'keep-alive';
/**
 * Create UUID
 * Reference: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 * @export
 * @returns
 */
function createUniqueIdentification(length) {
    if (length === void 0) { length = 6; }
    var strings = [];
    for (var i = 0; i < length; i++) {
        strings[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    return exports.prefix + "-" + strings.join('');
}
exports.default = createUniqueIdentification;
