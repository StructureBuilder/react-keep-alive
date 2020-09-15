import { prefix } from './createUniqueIdentification';
export default function createStoreElement() {
    var keepAliveDOM = document.createElement('div');
    keepAliveDOM.dataset.type = prefix;
    keepAliveDOM.style.display = 'none';
    document.body.appendChild(keepAliveDOM);
    return keepAliveDOM;
}
