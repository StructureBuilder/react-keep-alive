var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import noop from '../utils/noop';
var ReactComment = /** @class */ (function (_super) {
    __extends(ReactComment, _super);
    function ReactComment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReactComment.prototype.componentDidMount = function () {
        var node = ReactDOM.findDOMNode(this);
        var commentNode = this.createComment();
        this.commentNode = commentNode;
        this.currentNode = node;
        this.parentNode = node.parentNode;
        this.parentNode.replaceChild(commentNode, node);
        ReactDOM.unmountComponentAtNode(node);
        this.props.onLoaded();
    };
    ReactComment.prototype.componentWillUnmount = function () {
        this.parentNode.replaceChild(this.currentNode, this.commentNode);
    };
    ReactComment.prototype.createComment = function () {
        var content = this.props.children;
        if (typeof content !== 'string') {
            content = '';
        }
        this.content = content.trim();
        return document.createComment(this.content);
    };
    ReactComment.prototype.render = function () {
        return React.createElement("div", null);
    };
    ReactComment.defaultProps = {
        onLoaded: noop,
    };
    return ReactComment;
}(React.PureComponent));
export default ReactComment;
