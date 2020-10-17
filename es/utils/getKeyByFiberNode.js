import { WithKeepAliveContextConsumerDisplayName } from './withKeepAliveContextConsumer';
export default function getKeyByFiberNode(fiberNode) {
    if (!fiberNode) {
        return null;
    }
    var key = fiberNode.key, type = fiberNode.type;
    if (type.displayName && type.displayName.indexOf(WithKeepAliveContextConsumerDisplayName) !== -1) {
        return key;
    }
    return getKeyByFiberNode(fiberNode.return);
}
