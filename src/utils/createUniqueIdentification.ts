const hexDigits = '0123456789abcdef';

export const prefix = 'keep-alive';

/**
 * Create UUID
 * Reference: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 * @export
 * @returns
 */
export default function createUniqueIdentification(length = 6) {
  const strings = [];
  for (let i = 0; i < length; i++) {
    strings[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  return `${prefix}-${strings.join('')}`;
}
