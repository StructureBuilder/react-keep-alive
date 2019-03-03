const NODE_TYPES = {
  ELEMENT: 1,
  COMMENT: 8,
};

function findElementsBetweenComments(node, identification) {
  const elements = [];
  const childNodes = node.childNodes;
  let startCommentExist = false;
  for (let i = 0; i < childNodes.length; i++) {
    const child = childNodes[i];
    if (
      child.nodeType === NODE_TYPES.COMMENT &&
      child.nodeValue.trim() === identification && 
      !startCommentExist
    ) {
      startCommentExist = true;
    } else if (startCommentExist && child.nodeType === NODE_TYPES.ELEMENT) {
      elements.push(child);
    } else if (child.nodeType === NODE_TYPES.COMMENT && startCommentExist) {
      return elements;
    }
  }
  return elements;
}

function findComment(node, identification) {
  const childNodes = node.childNodes;
  for (let i = 0; i < childNodes.length; i++) {
    const child = childNodes[i];
    if (
      child.nodeType === NODE_TYPES.COMMENT &&
      child.nodeValue.trim() === identification
    ) {
      return child;
    }
  }
}

export default function changePositionByComment(identification, presentParentNode, originalParentNode) {
  if (!presentParentNode || !originalParentNode) {
    return;
  }
  const elementNodes = findElementsBetweenComments(originalParentNode, identification);
  const commentNode = findComment(presentParentNode, identification);
  if (!elementNodes.length || !commentNode) {
    return;
  }
  elementNodes.push(elementNodes[elementNodes.length - 1].nextSibling);
  elementNodes.unshift(elementNodes[0].previousSibling);
  // Deleting comment elements when using commet components will result in component uninstallation errors
  for (let i = elementNodes.length - 1; i >= 0; i--) {
    presentParentNode.insertBefore(elementNodes[i], commentNode);
  }
  originalParentNode.appendChild(commentNode);
}