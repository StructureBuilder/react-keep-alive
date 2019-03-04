export default function isRegExp(value: RegExp) {
  return value && Object.prototype.toString.call(value) === '[object RegExp]';
}
