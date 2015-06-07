'use strict';

// IE8+ Support
function on(el, type, callback) {
  if (el.addEventListener) {
    el.addEventListener(type, callback);
  } else {
    el.attachEvent('on' + type, function () {
      callback.call(el);
    });
  }
}

// IE8+ Support
function off(el, type, callback) {
  if (el.removeEventListener) {
    el.removeEventListener(type, callback);
  } else {
    el.detachEvent('on' + type, callback);
  }
}

function listenersForEach(listeners, callback) {
  for (var elementName in listeners) {
    var element = window[elementName];
    var eventNames = listeners[elementName];

    for (var eventName in eventNames) {
      callback(element, eventName, eventNames[eventName]);
    }
  }
}

module.exports = {
  componentDidMount: function componentDidMount() {
    var self = this;

    listenersForEach(this.listeners, function(element, eventName, callbackName) {
      on(element, eventName, self[callbackName]);
    });
  },
  componentWillUnmount: function componentWillUnmount() {
    var self = this;

    listenersForEach(this.listeners, function(element, eventName, callbackName) {
      off(element, eventName, self[callbackName]);
    });
  },
};
