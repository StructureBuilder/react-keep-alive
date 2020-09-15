"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * From react
 */
function is(x, y) {
    return ((x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y) // eslint-disable-line no-self-compare
    );
}
var hasOwnProperty = Object.prototype.hasOwnProperty;
function shallowEqual(objA, objB) {
    if (is(objA, objB)) {
        return true;
    }
    if (typeof objA !== 'object' ||
        objA === null ||
        typeof objB !== 'object' ||
        objB === null) {
        return false;
    }
    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) {
        return false;
    }
    // Test for A's keys different from B.
    for (var _i = 0, keysA_1 = keysA; _i < keysA_1.length; _i++) {
        var key = keysA_1[_i];
        if (!hasOwnProperty.call(objB, key) ||
            !is(objA[key], objB[key])) {
            return false;
        }
    }
    return true;
}
exports.default = shallowEqual;
