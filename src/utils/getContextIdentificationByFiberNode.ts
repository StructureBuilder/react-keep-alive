import React from 'react';
import {keepAliveProviderTypeName} from '../components/Provider';
import {keepAliveDisplayName} from './keepAlive';

export default function getContextIdentificationByFiberNode(fiberNode: any) {
  let globalKey: React.Key | null = null;
  let typeNames = '';
  function getPathsByFiberNode(fiberNode: any) {
    if (!fiberNode) {
      return '';
    }
    const {
      type,
      key,
      index,
    } = fiberNode;
    const typeName = type && type.displayName;
    if (typeName === keepAliveProviderTypeName) {
      return '';
    }
    const joinName: string = getPathsByFiberNode(fiberNode.return);
    if (type && type.displayName && type.displayName.indexOf(keepAliveDisplayName) !== -1) {
      if (!globalKey) {
        globalKey = key;
      }
    }
    typeNames += typeName;
    return `${key || index}${joinName}`;
  }
  const paths = getPathsByFiberNode(fiberNode);
  return {
    paths,
    globalKey,
    typeNames,
  };
}
