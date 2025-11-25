(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('reduxjs')) :
  typeof define === 'function' && define.amd ? define(['exports', 'reduxjs'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ReduxMockStore = {}, global.Redux));
})(this, function(exports, Redux) { 'use strict';

  const isFunction = arg => typeof arg === 'function';
  const isPlainObject = obj => {
    // https://stackoverflow.com/questions/5876332/how-can-i-differentiate-an-object-literal-from-other-javascript-objects
    if (typeof obj == 'object' && obj !== null) {
      if (typeof Object.getPrototypeOf == 'function') {
        var proto = Object.getPrototypeOf(obj);
        return proto === Object.prototype || proto === null;
      }
      return Object.prototype.toString.call(obj) == '[object Object]';
    }
    return false;
  };

  function configureStore (middlewares = []) {
    return function mockStore (getState = {}) {
      function mockStoreWithoutMiddleware () {
        let actions = []
        let listeners = []

        const self = {
          getState () {
            return isFunction(getState) ? getState(actions) : getState
          },

          getActions () {
            return actions
          },

          dispatch (action) {
            if (!isPlainObject(action)) {
              throw new Error(
                'Actions must be plain objects. ' +
                'Use custom middleware for async actions.'
              )
            }

            if (typeof action.type === 'undefined') {
              throw new Error(
                'Actions may not have an undefined "type" property. ' +
                'Have you misspelled a constant? ' +
                'Action: ' +
                JSON.stringify(action)
              )
            }

            actions.push(action)

            for (let i = 0; i < listeners.length; i++) {
              listeners[i]()
            }

            return action
          },

          clearActions () {
            actions = []
          },

          subscribe (cb) {
            if (isFunction(cb)) {
              listeners.push(cb)
            }

            return () => {
              const index = listeners.indexOf(cb)

              if (index < 0) {
                return
              }
              listeners.splice(index, 1)
            }
          },

          replaceReducer (nextReducer) {
            if (!isFunction(nextReducer)) {
              throw new Error('Expected the nextReducer to be a function.')
            }
          }
        }

        return self
      }

      const mockStoreWithMiddleware = Redux.applyMiddleware(
        ...middlewares
      )(mockStoreWithoutMiddleware)

      return mockStoreWithMiddleware()
    }
  }

  exports.configureStore = configureStore;

  Object.defineProperty(exports, '__esModule', { value: true });
});
