declare type EventNames = string | string[];
declare type Listener = (...args: any) => void;
export default function createEventEmitter(): {
    on: (eventNames: EventNames, listener: Listener, direction?: boolean) => void;
    off: (eventNames: EventNames, listener: Listener) => void;
    emit: (eventNames: EventNames, ...args: any) => void;
    clear: () => void;
    listenerCount: (eventNames: EventNames) => number;
    removeAllListeners: (eventNames: EventNames) => void;
};
export {};
