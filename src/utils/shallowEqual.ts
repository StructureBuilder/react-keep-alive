/**
 * From react
 */
function is(x: any, y: any) {
  return (
    (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y) // eslint-disable-line no-self-compare
  );
}

const hasOwnProperty = Object.prototype.hasOwnProperty;

function shallowEqual(objA: object, objB: object) {
  if (is(objA, objB)) {
    return true;
  }

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (const key of keysA) {
    if (
      !hasOwnProperty.call(objB, key) ||
      !is(objA[key], objB[key])
    ) {
      return false;
    }
  }

  return true;
}

export default shallowEqual;
