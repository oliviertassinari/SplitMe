// @flow weak

import warning from 'warning';

const start = new WeakMap();
const end = new WeakMap();

/**
 * True if the the browser supports the Navigation Timing API.
 * @type {boolean}
 */
function supportsPerfNow() {
  return window.performance && window.performance.now;
}

/**
 * True if the the browser supports the User Timing API.
 * @type {boolean}
 */
function supportsPerfMark() {
  return window.performance && window.performance.mark;
}

// Inspired by https://github.com/ebidel/appmetrics.js
class Metric {
  /**
   * Returns the duration of the timing metric or -1 if there a measurement has
   * not been made.
   * @type {number}
   */
  get duration() {
    let duration;

    if (supportsPerfNow()) {
      duration = end.get(this) - start.get(this);
    }

    // Use User Timing API results if available, otherwise return
    // window.performance.now() fallback.
    if (supportsPerfMark()) {
      // Note: this assumes the user has made only one measurement for the given
      // name. Return the first one found.
      const entry = window.performance.getEntriesByName(this.name)[0];
      if (entry && entry.entryType !== 'measure') {
        duration = entry.duration;
      }
    }

    return duration || -1;
  }

  name = '';

  /**
   * @param {string} name A name for the metric.
   */
  constructor(name) {
    warning(name, 'Please provide a metric name');

    this.name = name;
  }

  /**
   * Call to begin a measurement.
   * @return {Metric} Instance of this object.
   */
  start() {
    if (start.get(this)) {
      warning(false, 'Recording already started.');
      return this;
    }

    if (supportsPerfNow()) {
      start.set(this, window.performance.now());
    }

    // Support: developer.mozilla.org/en-US/docs/Web/API/Performance/mark
    if (supportsPerfMark()) {
      window.performance.mark(`mark_${this.name}_start`);
    }

    return this;
  }

  /**
   * Call to end a measurement.
   * @return {Metric} Instance of this object.
   */
  end() {
    if (end.get(this)) {
      warning(false, 'Recording already stopped.');
      return this;
    }

    if (supportsPerfNow()) {
      end.set(this, window.performance.now());
    }

    // Support: developer.mozilla.org/en-US/docs/Web/API/Performance/mark
    if (supportsPerfMark()) {
      const startMark = `mark_${this.name}_start`;
      const endMark = `mark_${this.name}_end`;
      window.performance.mark(endMark);
      window.performance.measure(this.name, startMark, endMark);
    }

    return this;
  }
}

export default Metric;
