"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var debug_1 = require("./debug");
var keepAliveDecorator_1 = require("./keepAliveDecorator");
var IdentificationContext_1 = __importDefault(require("../contexts/IdentificationContext"));
function useKeepAliveEffect(effect) {
    if (!react_1.useEffect) {
        debug_1.warn('[React Keep Alive] useKeepAliveEffect API requires react 16.8 or later.');
    }
    var _a = react_1.useContext(IdentificationContext_1.default), eventEmitter = _a.eventEmitter, identification = _a.identification;
    var effectRef = react_1.useRef(effect);
    effectRef.current = effect;
    react_1.useEffect(function () {
        var bindActivate = null;
        var bindUnactivate = null;
        var bindUnmount = null;
        var effectResult = effectRef.current();
        var unmounted = false;
        eventEmitter.on([identification, keepAliveDecorator_1.COMMAND.ACTIVATE], bindActivate = function () {
            // Delayed update
            Promise.resolve().then(function () {
                effectResult = effectRef.current();
            });
            unmounted = false;
        }, true);
        eventEmitter.on([identification, keepAliveDecorator_1.COMMAND.UNACTIVATE], bindUnactivate = function () {
            if (effectResult) {
                effectResult();
                unmounted = true;
            }
        }, true);
        eventEmitter.on([identification, keepAliveDecorator_1.COMMAND.UNMOUNT], bindUnmount = function () {
            if (effectResult) {
                effectResult();
                unmounted = true;
            }
        }, true);
        return function () {
            if (effectResult && !unmounted) {
                effectResult();
            }
            eventEmitter.off([identification, keepAliveDecorator_1.COMMAND.ACTIVATE], bindActivate);
            eventEmitter.off([identification, keepAliveDecorator_1.COMMAND.UNACTIVATE], bindUnactivate);
            eventEmitter.off([identification, keepAliveDecorator_1.COMMAND.UNMOUNT], bindUnmount);
        };
    }, []);
}
exports.default = useKeepAliveEffect;
