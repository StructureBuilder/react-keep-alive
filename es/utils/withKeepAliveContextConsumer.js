var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import * as React from 'react';
import KeepAliveContext from '../contexts/KeepAliveContext';
import getDisplayName from './getDisplayName';
export var WithKeepAliveContextConsumerDisplayName = 'withKeepAliveContextConsumer';
export default function withKeepAliveContextConsumer(Component) {
    var WithKeepAliveContextConsumer = function (props) { return (React.createElement(KeepAliveContext.Consumer, null, function (contextProps) { return React.createElement(Component, __assign({ _keepAliveContextProps: contextProps }, props)); })); };
    WithKeepAliveContextConsumer.displayName = WithKeepAliveContextConsumerDisplayName + "(" + getDisplayName(Component) + ")";
    return WithKeepAliveContextConsumer;
}
