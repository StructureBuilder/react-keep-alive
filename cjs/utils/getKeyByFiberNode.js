"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var withKeepAliveContextConsumer_1 = require("./withKeepAliveContextConsumer");
function getKeyByFiberNode(fiberNode) {
    if (!fiberNode) {
        return null;
    }
    var key = fiberNode.key, type = fiberNode.type;
    if (type.displayName && type.displayName.indexOf(withKeepAliveContextConsumer_1.WithKeepAliveContextConsumerDisplayName) !== -1) {
        return key;
    }
    return getKeyByFiberNode(fiberNode.return);
}
exports.default = getKeyByFiberNode;
