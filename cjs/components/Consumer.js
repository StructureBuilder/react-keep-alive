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
var Comment_1 = __importDefault(require("./Comment"));
var Provider_1 = require("./Provider");
var Consumer = /** @class */ (function (_super) {
    __extends(Consumer, _super);
    function Consumer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.identification = _this.props.identification;
        return _this;
    }
    Consumer.prototype.componentDidMount = function () {
        var _a = this.props, setCache = _a.setCache, children = _a.children, keepAlive = _a.keepAlive;
        this.renderElement = this.commentRef.parentNode;
        setCache(this.identification, {
            children: children,
            keepAlive: keepAlive,
            lifecycle: Provider_1.LIFECYCLE.MOUNTED,
            renderElement: this.renderElement,
            activated: true,
        });
    };
    Consumer.prototype.componentDidUpdate = function () {
        var _a = this.props, setCache = _a.setCache, children = _a.children, keepAlive = _a.keepAlive;
        setCache(this.identification, {
            children: children,
            keepAlive: keepAlive,
            lifecycle: Provider_1.LIFECYCLE.UPDATING,
        });
    };
    Consumer.prototype.componentWillUnmount = function () {
        var unactivate = this.props.unactivate;
        unactivate(this.identification);
    };
    Consumer.prototype.render = function () {
        var _this = this;
        var identification = this.identification;
        return React.createElement(Comment_1.default, { ref: function (ref) { return _this.commentRef = ref; } }, identification);
    };
    return Consumer;
}(React.PureComponent));
exports.default = Consumer;
