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
import IdentificationContext from '../contexts/IdentificationContext';
import getDisplayName from './getDisplayName';
export var withIdentificationContextConsumerDisplayName = 'withIdentificationContextConsumer';
export default function withIdentificationContextConsumer(Component) {
    var WithIdentificationContextConsumer = function (props) { return (React.createElement(IdentificationContext.Consumer, null, function (contextProps) { return React.createElement(Component, __assign({ _identificationContextProps: contextProps }, props)); })); };
    WithIdentificationContextConsumer.displayName = withIdentificationContextConsumerDisplayName + "(" + getDisplayName(Component) + ")";
    return WithIdentificationContextConsumer;
}
