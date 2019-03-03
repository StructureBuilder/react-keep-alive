export default function findDOMNodeByFiberNode(fiberNode) {
  if (!fiberNode) {
    return null;
  }
  const {
    stateNode, 
    return: parent,
  } = fiberNode;
  if (!parent) {
    return stateNode && stateNode.containerInfo;
  }
  if (stateNode && stateNode.nodeType) {
    return stateNode;
  }
  return findDOMNodeByFiberNode(parent);
}