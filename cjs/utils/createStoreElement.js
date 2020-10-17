"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createUniqueIdentification_1 = require("./createUniqueIdentification");
function createStoreElement() {
    var keepAliveDOM = document.createElement('div');
    keepAliveDOM.dataset.type = createUniqueIdentification_1.prefix;
    keepAliveDOM.style.display = 'none';
    document.body.appendChild(keepAliveDOM);
    return keepAliveDOM;
}
exports.default = createStoreElement;
