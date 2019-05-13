import React, {useEffect, useContext, useRef, useState} from 'react';
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
    let bindActivate: (() => void) | null = null;
    let bindUnactivate: (() => void) | null = null;
    let bindUnmount: (() => void) | null = null;
    let effectResult = effectRef.current();
    let unmounted = false;
    eventEmitter.on(
      [identification, COMMAND.ACTIVATE],
      bindActivate = () => {
        // Delayed update
        Promise.resolve().then(() => {
          effectResult = effectRef.current();
        });
        unmounted = false;
      },
      true,
    );
    eventEmitter.on(
      [identification, COMMAND.UNACTIVATE],
      bindUnactivate = () => {
        if (effectResult) {
          effectResult();
          unmounted = true;
        }
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
        [identification, COMMAND.ACTIVATE],
        bindActivate,
      );
      eventEmitter.off(
        [identification, COMMAND.UNACTIVATE],
        bindUnactivate,
      );
      eventEmitter.off(
        [identification, COMMAND.UNMOUNT],
        bindUnmount,
      );
    };
  }, []);
}
