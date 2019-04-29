import {prefix} from './createUniqueIdentification';

export default function createStoreElement(): HTMLElement {
  const keepAliveDOM = document.createElement('div');
  keepAliveDOM.dataset.type = prefix;
  keepAliveDOM.style.visibility = 'hidden';
  keepAliveDOM.style.opacity = '0';
  keepAliveDOM.style.position = 'absolute';
  keepAliveDOM.style.top = '0';
  keepAliveDOM.style.left = '0';
  keepAliveDOM.style.zIndex = '-1';
  document.body.appendChild(keepAliveDOM);
  return keepAliveDOM;
}
