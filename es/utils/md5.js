import md5 from 'js-md5';
import { prefix } from './createUniqueIdentification';
export default function createMD5(value, length) {
    if (value === void 0) { value = ''; }
    if (length === void 0) { length = 6; }
    return prefix + "-" + md5(value).substr(0, length);
}
