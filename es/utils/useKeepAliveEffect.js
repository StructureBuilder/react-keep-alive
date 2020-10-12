import { useEffect, useContext, useRef } from 'react';
import { warn } from './debug';
import { COMMAND } from './keepAliveDecorator';
import IdentificationContext from '../contexts/IdentificationContext';
export default function useKeepAliveEffect(effect) {
    if (!useEffect) {
        warn('[React Keep Alive] useKeepAliveEffect API requires react 16.8 or later.');
    }
    var _a = useContext(IdentificationContext), eventEmitter = _a.eventEmitter, identification = _a.identification;
    var effectRef = useRef(effect);
    effectRef.current = effect;
    useEffect(function () {
        var bindActivate = null;
        var bindUnactivate = null;
        var bindUnmount = null;
        var effectResult = effectRef.current();
        var unmounted = false;
        eventEmitter.on([identification, COMMAND.ACTIVATE], bindActivate = function () {
            // Delayed update
            Promise.resolve().then(function () {
                effectResult = effectRef.current();
            });
            unmounted = false;
        }, true);
        eventEmitter.on([identification, COMMAND.UNACTIVATE], bindUnactivate = function () {
            if (effectResult) {
                effectResult();
                unmounted = true;
            }
        }, true);
        eventEmitter.on([identification, COMMAND.UNMOUNT], bindUnmount = function () {
            if (effectResult) {
                effectResult();
                unmounted = true;
            }
        }, true);
        return function () {
            if (effectResult && !unmounted) {
                effectResult();
            }
            eventEmitter.off([identification, COMMAND.ACTIVATE], bindActivate);
            eventEmitter.off([identification, COMMAND.UNACTIVATE], bindUnactivate);
            eventEmitter.off([identification, COMMAND.UNMOUNT], bindUnmount);
        };
    }, []);
}
