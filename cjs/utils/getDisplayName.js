"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getDisplayName(Component) {
    return Component.displayName || Component.name || 'Component';
}
exports.default = getDisplayName;
