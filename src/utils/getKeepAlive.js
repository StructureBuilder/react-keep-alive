export default function getKeepAlive(keepAlive) {
  return keepAlive === undefined ? true : keepAlive;
}