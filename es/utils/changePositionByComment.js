var NODE_TYPES;
(function (NODE_TYPES) {
    NODE_TYPES[NODE_TYPES["ELEMENT"] = 1] = "ELEMENT";
    NODE_TYPES[NODE_TYPES["COMMENT"] = 8] = "COMMENT";
})(NODE_TYPES || (NODE_TYPES = {}));
function findElementsBetweenComments(node, identification) {
    var elements = [];
    var childNodes = node.childNodes;
    var startCommentExist = false;
    for (var _i = 0, childNodes_1 = childNodes; _i < childNodes_1.length; _i++) {
        var child = childNodes_1[_i];
        if (child.nodeType === NODE_TYPES.COMMENT &&
            child.nodeValue.trim() === identification &&
            !startCommentExist) {
            startCommentExist = true;
        }
        else if (startCommentExist && child.nodeType === NODE_TYPES.ELEMENT) {
            elements.push(child);
        }
        else if (child.nodeType === NODE_TYPES.COMMENT && startCommentExist) {
            return elements;
        }
    }
    return elements;
}
function findComment(node, identification) {
    var childNodes = node.childNodes;
    for (var _i = 0, childNodes_2 = childNodes; _i < childNodes_2.length; _i++) {
        var child = childNodes_2[_i];
        if (child.nodeType === NODE_TYPES.COMMENT &&
            child.nodeValue.trim() === identification) {
            return child;
        }
    }
}
export default function changePositionByComment(identification, presentParentNode, originalParentNode) {
    if (!presentParentNode || !originalParentNode) {
        return;
    }
    var elementNodes = findElementsBetweenComments(originalParentNode, identification);
    var commentNode = findComment(presentParentNode, identification);
    if (!elementNodes.length || !commentNode) {
        return;
    }
    elementNodes.push(elementNodes[elementNodes.length - 1].nextSibling);
    elementNodes.unshift(elementNodes[0].previousSibling);
    // Deleting comment elements when using commet components will result in component uninstallation errors
    for (var i = elementNodes.length - 1; i >= 0; i--) {
        presentParentNode.insertBefore(elementNodes[i], commentNode);
    }
    originalParentNode.appendChild(commentNode);
}
