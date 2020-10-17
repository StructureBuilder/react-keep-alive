"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isRegExp(value) {
    return value && Object.prototype.toString.call(value) === '[object RegExp]';
}
exports.default = isRegExp;
