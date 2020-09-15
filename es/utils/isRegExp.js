export default function isRegExp(value) {
    return value && Object.prototype.toString.call(value) === '[object RegExp]';
}
