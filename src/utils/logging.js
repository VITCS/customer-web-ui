import { Analytics } from 'aws-amplify';

const tryRecordEvent = (eventName, eventProperties) => {
  try {
    Analytics.record(eventName, eventProperties);
  } catch (e) {
    // console.log(e);
  }
};
const newConsole = (function (oldCons) {
  return {
    log: (...args) => {
      //   Analytics.record({
      //     name: 'info',
      //     attributes: {
      //       ...args,
      //     },
      //   });
      oldCons.log(...args);
      // Your code
    },
    info: (...args) => {
      //   oldCons.info(...args);

      tryRecordEvent({
        name: 'info',
        attributes: {
          ...args,
        },
      });
      // Your code
    },
    warn: (...args) => {
      oldCons.warn(...args);

      tryRecordEvent({
        name: 'warning',

        attributes: {
          ...args,
        },
      });
      // Your code
    },
    error: (...args) => {
      oldCons.error(...args);

      tryRecordEvent({
        name: 'error',
        attributes: {
          ...args,
        },
      });
      // Your code
    },
  };
})(window.console);

window.console = newConsole;
