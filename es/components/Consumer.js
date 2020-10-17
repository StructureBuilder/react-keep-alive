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
import Comment from './Comment';
import { LIFECYCLE } from './Provider';
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
            lifecycle: LIFECYCLE.MOUNTED,
            renderElement: this.renderElement,
            activated: true,
        });
    };
    Consumer.prototype.componentDidUpdate = function () {
        var _a = this.props, setCache = _a.setCache, children = _a.children, keepAlive = _a.keepAlive;
        setCache(this.identification, {
            children: children,
            keepAlive: keepAlive,
            lifecycle: LIFECYCLE.UPDATING,
        });
    };
    Consumer.prototype.componentWillUnmount = function () {
        var unactivate = this.props.unactivate;
        unactivate(this.identification);
    };
    Consumer.prototype.render = function () {
        var _this = this;
        var identification = this.identification;
        return React.createElement(Comment, { ref: function (ref) { return _this.commentRef = ref; } }, identification);
    };
    return Consumer;
}(React.PureComponent));
export default Consumer;
