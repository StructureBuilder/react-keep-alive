import React, {useEffect, useContext, useRef} from 'react';
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
  const effectRef: React.MutableRefObject<React.EffectCallback> = useRef(effect);
  effectRef.current = effect;
  useEffect(() => {
    let bindMount: (() => void) | null = null;
    let bindUnmount: (() => void) | null = null;
    let effectResult = effectRef.current();
    let unmounted = false;
    eventEmitter.on(
      [identification, COMMAND.MOUNT],
      bindMount = () => {
        effectResult = effectRef.current();
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
