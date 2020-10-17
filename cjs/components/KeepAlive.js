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
var AsyncComponent_1 = __importDefault(require("./AsyncComponent"));
var Provider_1 = require("./Provider");
var keepAliveDecorator_1 = __importStar(require("../utils/keepAliveDecorator"));
var changePositionByComment_1 = __importDefault(require("../utils/changePositionByComment"));
var KeepAlive = /** @class */ (function (_super) {
    __extends(KeepAlive, _super);
    function KeepAlive() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.bindUnmount = null;
        _this.bindUnactivate = null;
        _this.unmounted = false;
        _this.mounted = false;
        _this.ref = null;
        _this.refNextSibling = null;
        _this.childNodes = [];
        _this.correctionPosition = function () {
            if (_this.ref && _this.ref.parentNode && _this.ref.nextSibling) {
                var childNodes = _this.ref.childNodes;
                _this.refNextSibling = _this.ref.nextSibling;
                _this.childNodes = [];
                while (childNodes.length) {
                    var child = childNodes[0];
                    _this.childNodes.push(child);
                    _this.ref.parentNode.insertBefore(child, _this.ref.nextSibling);
                }
                _this.ref.parentNode.removeChild(_this.ref);
            }
        };
        _this.retreatPosition = function () {
            if (_this.ref && _this.refNextSibling && _this.refNextSibling.parentNode) {
                for (var _i = 0, _a = _this.childNodes; _i < _a.length; _i++) {
                    var child = _a[_i];
                    _this.ref.appendChild(child);
                }
                _this.refNextSibling.parentNode.insertBefore(_this.ref, _this.refNextSibling);
            }
        };
        _this.setMounted = function (value) {
            _this.mounted = value;
        };
        _this.getMounted = function () {
            return _this.mounted;
        };
        return _this;
    }
    KeepAlive.prototype.componentDidMount = function () {
        var _this = this;
        var _container = this.props._container;
        var notNeedActivate = _container.notNeedActivate, identification = _container.identification, eventEmitter = _container.eventEmitter, keepAlive = _container.keepAlive;
        notNeedActivate();
        var cb = function () {
            _this.mount();
            _this.listen();
            eventEmitter.off([identification, Provider_1.START_MOUNTING_DOM], cb);
        };
        eventEmitter.on([identification, Provider_1.START_MOUNTING_DOM], cb);
        if (keepAlive) {
            this.componentDidActivate();
        }
    };
    KeepAlive.prototype.componentDidActivate = function () {
        // tslint-disable
    };
    KeepAlive.prototype.componentDidUpdate = function () {
        var _container = this.props._container;
        var notNeedActivate = _container.notNeedActivate, isNeedActivate = _container.isNeedActivate;
        if (isNeedActivate()) {
            notNeedActivate();
            this.mount();
            this.listen();
            this.unmounted = false;
            this.componentDidActivate();
        }
    };
    KeepAlive.prototype.componentWillUnactivate = function () {
        this.unmount();
        this.unlisten();
    };
    KeepAlive.prototype.componentWillUnmount = function () {
        if (!this.unmounted) {
            this.unmounted = true;
            this.unmount();
            this.unlisten();
        }
    };
    KeepAlive.prototype.mount = function () {
        var _a = this.props._container, cache = _a.cache, identification = _a.identification, storeElement = _a.storeElement, setLifecycle = _a.setLifecycle;
        this.setMounted(true);
        var renderElement = cache[identification].renderElement;
        setLifecycle(Provider_1.LIFECYCLE.UPDATING);
        changePositionByComment_1.default(identification, renderElement, storeElement);
    };
    KeepAlive.prototype.unmount = function () {
        var _a = this.props._container, identification = _a.identification, storeElement = _a.storeElement, cache = _a.cache, setLifecycle = _a.setLifecycle;
        if (cache[identification]) {
            var _b = cache[identification], renderElement = _b.renderElement, ifStillActivate = _b.ifStillActivate, reactivate = _b.reactivate;
            setLifecycle(Provider_1.LIFECYCLE.UNMOUNTED);
            this.retreatPosition();
            changePositionByComment_1.default(identification, storeElement, renderElement);
            if (ifStillActivate) {
                reactivate();
            }
        }
    };
    KeepAlive.prototype.listen = function () {
        var _a = this.props._container, identification = _a.identification, eventEmitter = _a.eventEmitter;
        eventEmitter.on([identification, keepAliveDecorator_1.COMMAND.CURRENT_UNMOUNT], this.bindUnmount = this.componentWillUnmount.bind(this));
        eventEmitter.on([identification, keepAliveDecorator_1.COMMAND.CURRENT_UNACTIVATE], this.bindUnactivate = this.componentWillUnactivate.bind(this));
    };
    KeepAlive.prototype.unlisten = function () {
        var _a = this.props._container, identification = _a.identification, eventEmitter = _a.eventEmitter;
        eventEmitter.off([identification, keepAliveDecorator_1.COMMAND.CURRENT_UNMOUNT], this.bindUnmount);
        eventEmitter.off([identification, keepAliveDecorator_1.COMMAND.CURRENT_UNACTIVATE], this.bindUnactivate);
    };
    KeepAlive.prototype.render = function () {
        var _this = this;
        // The purpose of this div is to not report an error when moving the DOM,
        // so you need to remove this div later.
        return (React.createElement("div", { ref: function (ref) { return _this.ref = ref; } },
            React.createElement(AsyncComponent_1.default, { setMounted: this.setMounted, getMounted: this.getMounted, onUpdate: this.correctionPosition }, this.props.children)));
    };
    return KeepAlive;
}(React.PureComponent));
exports.default = keepAliveDecorator_1.default(KeepAlive);
