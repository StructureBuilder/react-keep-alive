import isRegExp from './isRegExp';
function matches(pattern, name) {
    if (Array.isArray(pattern)) {
        return pattern.indexOf(name) > -1;
    }
    else if (typeof pattern === 'string') {
        return pattern.split(',').indexOf(name) > -1;
    }
    else if (isRegExp(pattern)) {
        return pattern.test(name);
    }
    return false;
}
export default function getKeepAlive(name, include, exclude, disabled) {
    if (disabled !== undefined) {
        return !disabled;
    }
    if ((include && (!name || !matches(include, name))) ||
        (exclude && name && matches(exclude, name))) {
        return false;
    }
    return true;
}
