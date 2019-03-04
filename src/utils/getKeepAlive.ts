import isRegExp from './isRegExp';

type Pattern = string | string[] | RegExp;

function matches (pattern: Pattern, name: string) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1;
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1;
  } else if (isRegExp(pattern)) {
    return pattern.test(name);
  }
  return false;
}

export default function getKeepAlive(
  name: string,
  include?: Pattern,
  exclude?: Pattern,
  keepAlive?: boolean
) {
  if (keepAlive !== undefined) {
    return keepAlive;
  }
  if (
    (include && (!name || !matches(include, name))) ||
    (exclude && name && matches(exclude, name))
  ) {
    return false;
  }
  return true;
}
