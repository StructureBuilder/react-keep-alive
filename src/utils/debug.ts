type Warn = (message?: string) => void;

export let warn: Warn = () => undefined;

if (process.env.NODE_ENV !== 'production') {
  /**
   * Prints a warning in the console if it exists.
   *
   * @param {*} message
   */
  warn = message => {
    if (typeof console !== undefined && typeof console.error === 'function') {
      console.error(message);
    } else {
      throw new Error(message);
    }
  };
}
