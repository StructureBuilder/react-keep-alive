import {warn} from './debug';

type EventNames = string | string[];

type Listener = (...args: any) => void;

export default function createEventEmitter() {
  let events = Object.create(null);

  function on(eventNames: EventNames, listener: Listener, direction = false) {
    eventNames = getEventNames(eventNames);
    let current = events;
    const maxIndex =  eventNames.length - 1;
    for (let i = 0; i < eventNames.length; i++) {
      const key = eventNames[i];
      if (!current[key]) {
        current[key] = i === maxIndex ? [] : {};
      }
      current = current[key];
    }
    if (!Array.isArray(current)) {
      warn('[React Keep Alive] Access path error.');
    }
    if (direction) {
      current.unshift(listener);
    } else {
      current.push(listener);
    }
  }

  function off(eventNames: EventNames, listener: Listener) {
    const listeners = getListeners(eventNames);
    if (!listeners) {
      return;
    }
    const matchIndex = listeners.findIndex((v: Listener) => v === listener);
    if (matchIndex !== -1) {
      listeners.splice(matchIndex, 1);
    }
  }

  function removeAllListeners(eventNames: EventNames) {
    const listeners = getListeners(eventNames);
    if (!listeners) {
      return;
    }
    eventNames = getEventNames(eventNames);
    const lastEventName = eventNames.pop();
    if (lastEventName) {
      const event = eventNames.reduce((obj, key) => obj[key], events);
      event[lastEventName] = [];
    }
  }

  function emit(eventNames: EventNames, ...args: any) {
    const listeners = getListeners(eventNames);
    if (!listeners) {
      return;
    }
    for (const listener of listeners) {
      if (listener) {
        listener(...args);
      }
    }
  }

  function listenerCount(eventNames: EventNames) {
    const listeners =  getListeners(eventNames);
    return listeners ? listeners.length : 0;
  }

  function clear() {
    events = Object.create(null);
  }

  function getListeners(eventNames: EventNames): Listener[] | undefined {
    eventNames = getEventNames(eventNames);
    try {
      return eventNames.reduce((obj, key) => obj[key], events);
    } catch (e) {
      return;
    }
  }

  function getEventNames(eventNames: EventNames): string[] {
    if (!eventNames) {
      warn('[React Keep Alive] Must exist event name.');
    }
    if (typeof eventNames === 'string') {
      eventNames = [eventNames];
    }
    return eventNames;
  }

  return {
    on,
    off,
    emit,
    clear,
    listenerCount,
    removeAllListeners,
  };
}
