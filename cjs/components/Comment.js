"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var ReactDOM = __importStar(require("react-dom"));
var noop_1 = __importDefault(require("../utils/noop"));
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
        onLoaded: noop_1.default,
    };
    return ReactComment;
}(React.PureComponent));
exports.default = ReactComment;
