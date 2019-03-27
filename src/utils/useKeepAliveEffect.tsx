import React, {useEffect, useContext} from 'react';
import {warn} from './debug';
import {COMMAND} from './keepAliveDecorator';
import IdentificationContext, {IIdentificationContextProps} from '../contexts/IdentificationContext';

export default function useKeepAliveEffect(effect: React.EffectCallback) {
  if (!useEffect) {
    warn('[React Keep Alive] useKeepAliveEffect API requires react 16.8 or later.');
  }
  const {
    eventEmitter,
    identification,
  } = useContext<IIdentificationContextProps>(IdentificationContext);
  useEffect(() => {
    let bindMount: (() => void) | null = null;
    let bindUnmount: (() => void) | null = null;
    let effectResult = effect();
    let unmounted = false;
    eventEmitter.on(
      [identification, COMMAND.MOUNT],
      bindMount = () => {
        effectResult = effect();
        unmounted = false;
      },
      true,
    );
    eventEmitter.on(
      [identification, COMMAND.UNMOUNT],
      bindUnmount = () => {
        if (effectResult) {
          effectResult();
          unmounted = true;
        }
      },
      true,
    );
    return () => {
      if (effectResult && !unmounted) {
        effectResult();
      }
      eventEmitter.off(
        [identification, COMMAND.MOUNT],
        bindMount,
      );
      eventEmitter.off(
        [identification, COMMAND.UNMOUNT],
        bindUnmount,
      );
    };
  }, []);
}
