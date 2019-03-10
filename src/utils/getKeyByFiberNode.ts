import {WithKeepAliveContextConsumerDisplayName} from './withKeepAliveContextConsumer';

export default function getKeyByFiberNode(fiberNode: any): string | null {
  if (!fiberNode) {
    return null;
  }
  const {
    key,
    type,
  } = fiberNode;
  if (type.displayName && type.displayName.indexOf(WithKeepAliveContextConsumerDisplayName) !== -1) {
    return key;
  }
  return getKeyByFiberNode(fiberNode.return);
}
