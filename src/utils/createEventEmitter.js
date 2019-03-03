export default function createEventEmitter() {
  let events = Object.create(null);

  function on(eventNames, listener, direction = false) {
    eventNames = getEventNames(eventNames);
    let current = events;
    const maxIndex =  eventNames.length - 1;
    for (let i = 0; i < eventNames.length; i++) {
      const key = eventNames[i];
      if (!current[key]) {
        current[key] = i === maxIndex ? [] : {};
      };
      current = current[key];
    }
    if (!Array.isArray(current)) {
      throw new Error('Access path error.');
    }
    if (direction) {
      current.unshift(listener);
    } else {
      current.push(listener);
    }
  }

  function off(eventNames, listener) {
    const listeners = getListeners(eventNames);
    if (!listeners) {
      return;
    }
    const matchIndex = listeners.findIndex(v => v === listener);
    if (matchIndex !== -1) {
      listeners.splice(matchIndex, 1);
    }
  }

  function removeAllListeners(eventNames) {
    const listeners = getListeners(eventNames);
    if (!listeners) {
      return;
    }
    eventNames = getEventNames(eventNames);
    const lastEventName = eventNames.pop();
    const event = eventNames.reduce((obj, key) => obj[key], events);
    event[lastEventName] = [];
  }

  function emit(eventNames, ...args) {
    const listeners = getListeners(eventNames);
    if (!listeners) {
      return;
    }
    for (let i = 0; i < listeners.length; i++) {
      if (listeners[i]) {
        listeners[i](...args);
      }
    }
  }

  function listenerCount(eventNames) {
    const listeners =  getListeners(eventNames);
    return listeners ? listeners.length : 0;
  }

  function clear() {
    events = Object.create(null);
  }

  function getListeners(eventNames) {
    eventNames = getEventNames(eventNames);
    try {
      return eventNames.reduce((obj, key) => obj[key], events);
    } catch (e) {}
  }

  function getEventNames(eventNames) {
    if (!eventNames) {
      throw new Error('Must exist event name.');
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
};