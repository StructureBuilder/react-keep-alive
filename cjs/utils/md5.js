"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var js_md5_1 = __importDefault(require("js-md5"));
var createUniqueIdentification_1 = require("./createUniqueIdentification");
function createMD5(value, length) {
    if (value === void 0) { value = ''; }
    if (length === void 0) { length = 6; }
    return createUniqueIdentification_1.prefix + "-" + js_md5_1.default(value).substr(0, length);
}
exports.default = createMD5;
