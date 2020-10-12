"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var debug_1 = require("./debug");
function createEventEmitter() {
    var events = Object.create(null);
    function on(eventNames, listener, direction) {
        if (direction === void 0) { direction = false; }
        eventNames = getEventNames(eventNames);
        var current = events;
        var maxIndex = eventNames.length - 1;
        for (var i = 0; i < eventNames.length; i++) {
            var key = eventNames[i];
            if (!current[key]) {
                current[key] = i === maxIndex ? [] : {};
            }
            current = current[key];
        }
        if (!Array.isArray(current)) {
            debug_1.warn('[React Keep Alive] Access path error.');
        }
        if (direction) {
            current.unshift(listener);
        }
        else {
            current.push(listener);
        }
    }
    function off(eventNames, listener) {
        var listeners = getListeners(eventNames);
        if (!listeners) {
            return;
        }
        var matchIndex = listeners.findIndex(function (v) { return v === listener; });
        if (matchIndex !== -1) {
            listeners.splice(matchIndex, 1);
        }
    }
    function removeAllListeners(eventNames) {
        var listeners = getListeners(eventNames);
        if (!listeners) {
            return;
        }
        eventNames = getEventNames(eventNames);
        var lastEventName = eventNames.pop();
        if (lastEventName) {
            var event_1 = eventNames.reduce(function (obj, key) { return obj[key]; }, events);
            event_1[lastEventName] = [];
        }
    }
    function emit(eventNames) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var listeners = getListeners(eventNames);
        if (!listeners) {
            return;
        }
        for (var _a = 0, listeners_1 = listeners; _a < listeners_1.length; _a++) {
            var listener = listeners_1[_a];
            if (listener) {
                listener.apply(void 0, args);
            }
        }
    }
    function listenerCount(eventNames) {
        var listeners = getListeners(eventNames);
        return listeners ? listeners.length : 0;
    }
    function clear() {
        events = Object.create(null);
    }
    function getListeners(eventNames) {
        eventNames = getEventNames(eventNames);
        try {
            return eventNames.reduce(function (obj, key) { return obj[key]; }, events);
        }
        catch (e) {
            return;
        }
    }
    function getEventNames(eventNames) {
        if (!eventNames) {
            debug_1.warn('[React Keep Alive] Must exist event name.');
        }
        if (typeof eventNames === 'string') {
            eventNames = [eventNames];
        }
        return eventNames;
    }
    return {
        on: on,
        off: off,
        emit: emit,
        clear: clear,
        listenerCount: listenerCount,
        removeAllListeners: removeAllListeners,
    };
}
exports.default = createEventEmitter;
