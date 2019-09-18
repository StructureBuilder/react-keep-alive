export function getStateBackup(instance) {
  const root = instance;
  let node = root
  const backupRoot = {};
  let backupNode = backupRoot;
  while (true) {
    if (node.stateNode !== null && typeof node.type === 'function') {
      backupNode.state = node.stateNode.state
      backupNode.constructor = node.stateNode.constructor
      backupNode.instance = node.stateNode
    }
    if (node.child) {
      node.child.return = node
      node = node.child
      backupNode.child = {
        return: backupNode,
      };
      backupNode = backupNode.child;
      continue
    }
    if (node === root) {
      return backupRoot
    }
    while (!node.sibling) {
      if (!node.return || node.return === root) {
        return backupRoot
      }
      node = node.return
      backupNode = backupNode.return;
    }
    node.sibling.return = node.return
    node = node.sibling
    backupNode.sibling = {
      return: backupNode.return,
    };
    backupNode = backupNode.sibling;
  }
}

const excludes = ['props', 'state', 'context', 'refs', 'updater', '_reactInternalFiber', '_reactInternalInstance'];

export function deepForceUpdateByBackup(instance, backup) {
  const root = instance._reactInternalFiber || instance._reactInternalInstance
  let node = root
  while (true) {
    if (node.stateNode !== null && typeof node.type === 'function') {
      const publicInstance = node.stateNode
      const { updater } = publicInstance
      // TODO:
      // 无法修改箭头函数的 this 指向
      Object.keys(backup.instance).forEach(key => {
        if (~excludes.indexOf(key)) {
          return
        }
        if (typeof backup.instance[key] === 'function') {
          return
        }
        publicInstance[key] = backup.instance[key]
      });
      if (typeof publicInstance.setState === 'function') {
        publicInstance.setState(backup.state, () => {
          console.log();
        })
      } else if (updater && typeof updater.enqueueSetState === 'function') {
        updater.enqueueSetState(publicInstance, backup.state)
      }
    }
    if (node.child) {
      node.child.return = node
      node = node.child
      if (backup.child) {
        backup.child.return = backup
        backup = backup.child
      }
      continue
    }
    if (node === root) {
      return undefined
    }
    while (!node.sibling) {
      if (!node.return || node.return === root) {
        return undefined
      }
      node = node.return
      backup = backup.return
    }
    node.sibling.return = node.return
    node = node.sibling
    if (backup.sibling) {
      backup.sibling.return = backup.return
      backup = backup.sibling
    }
  }
}
