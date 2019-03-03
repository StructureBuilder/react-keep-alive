import {keepAliveProviderTypeName} from '../components/Provider';

export default function getContextIdentificationByFiberNode(fiberNode) {
  let globalKey = null;
  let typeNames = '';
  function getPathsByFiberNode(fiberNode) {
    if (!fiberNode) {
      return '';
    }
    const {
      type,
      key,
      index,
    } = fiberNode;
    let typeName = type && type.name ? type.name : '';
    if (typeName === keepAliveProviderTypeName) {
      return '';
    }
    const joinName = getPathsByFiberNode(fiberNode.return);
    if (type && type.displayName && type.displayName.indexOf('keepAlive') !== -1) {
      if (!globalKey) {
        globalKey = key;
      }
    }
    typeNames += typeName;
    return `${key || index}${joinName}`;
  }
  const paths = getPathsByFiberNode(fiberNode);
  return {
    paths,
    globalKey,
    typeNames,
  };
}