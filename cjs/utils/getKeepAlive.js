"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var isRegExp_1 = __importDefault(require("./isRegExp"));
function matches(pattern, name) {
    if (Array.isArray(pattern)) {
        return pattern.indexOf(name) > -1;
    }
    else if (typeof pattern === 'string') {
        return pattern.split(',').indexOf(name) > -1;
    }
    else if (isRegExp_1.default(pattern)) {
        return pattern.test(name);
    }
    return false;
}
function getKeepAlive(name, include, exclude, disabled) {
    if (disabled !== undefined) {
        return !disabled;
    }
    if ((include && (!name || !matches(include, name))) ||
        (exclude && name && matches(exclude, name))) {
        return false;
    }
    return true;
}
exports.default = getKeepAlive;
