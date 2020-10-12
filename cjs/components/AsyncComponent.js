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
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var bindLifecycle_1 = require("../utils/bindLifecycle");
var AsyncComponent = /** @class */ (function (_super) {
    __extends(AsyncComponent, _super);
    function AsyncComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            component: null,
        };
        return _this;
    }
    /**
     * Force update child nodes
     *
     * @private
     * @returns
     * @memberof AsyncComponent
     */
    AsyncComponent.prototype.forceUpdateChildren = function () {
        if (!this.props.children) {
            return;
        }
        var root = this._reactInternalFiber || this._reactInternalInstance;
        var node = root.child;
        var sibling = node;
        while (sibling) {
            while (true) {
                if (node.type && node.type.displayName && node.type.displayName.indexOf(bindLifecycle_1.bindLifecycleTypeName) !== -1) {
                    return;
                }
                if (node.stateNode) {
                    break;
                }
                node = node.child;
            }
            if (typeof node.type === 'function') {
                node.stateNode.forceUpdate();
            }
            sibling = sibling.sibling;
        }
    };
    AsyncComponent.prototype.componentDidMount = function () {
        var _this = this;
        var children = this.props.children;
        Promise.resolve().then(function () { return _this.setState({ component: children }); });
    };
    AsyncComponent.prototype.componentDidUpdate = function () {
        this.props.onUpdate();
    };
    // Delayed update
    // In order to be able to get real DOM data
    AsyncComponent.prototype.shouldComponentUpdate = function () {
        var _this = this;
        if (!this.state.component) {
            // If it is already mounted asynchronously, you don't need to do it again when you update it.
            this.props.setMounted(false);
            return true;
        }
        Promise.resolve().then(function () {
            if (_this.props.getMounted()) {
                _this.props.setMounted(false);
                _this.forceUpdateChildren();
                _this.props.onUpdate();
            }
        });
        return false;
    };
    AsyncComponent.prototype.render = function () {
        return this.state.component;
    };
    return AsyncComponent;
}(React.Component));
exports.default = AsyncComponent;
