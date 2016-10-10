// @flow weak

import analytics from 'modules/analytics/analytics';

/**
 * The window.performance.timing model is explained here:
 * https://www.w3.org/TR/navigation-timing/#processing-model.
 * Use the following project as inspiration
 *  - https://github.com/addyosmani/timing.js/blob/master/timing.js
 *  - https://gist.github.com/acdha/a1fd7e91f8cd5c1f6916
 *  - https://github.com/okor/justice/blob/master/src/js/justice.collectors.js
 */

function supportsPerfNow() {
  return window.performance && window.performance.now;
}

function supportsPerfTiming() {
  if (window.performance && window.performance.timing) {
    // IE9 bug where navigationStart will be 0 until after the browser updates the
    // performance.timing data structure.
    if (window.performance.timing.navigationStart !== 0) {
      return true;
    }
  }

  return false;
}

function getTimeSinceNavigationStart() {
  if (!supportsPerfNow()) {
    return null;
  }

  return Math.round(window.performance.now());
}

/**
 * Returns the browser first byte received metric (if available).
 *
 * @return {number} The first byte time in ms.
 */
function getTimeToFirstByte() {
  if (!supportsPerfTiming()) {
    return null;
  }

  const timing = window.performance.timing;

  return timing.responseStart - timing.navigationStart;
}

/**
 * Returns the browser's first paint metric (if available).
 *
 * @return {number} The first paint time in ms.
 */
function getTimeToFirstPaint() {
  if (window.chrome && window.chrome.loadTimes) {
    const load = window.chrome.loadTimes();
    const firstPaintTime = (load.firstPaintTime - load.startLoadTime) * 1000;

    return Math.round(firstPaintTime);
  } else if (supportsPerfTiming()) {
    const timing = window.performance.timing;

    // See http://msdn.microsoft.com/ff974719
    if (timing.msFirstPaint) {
      return timing.msFirstPaint - timing.navigationStart;
    }
  }

  return null;
}

const SAMPLE_RATE = 30; // %

// Track key moments in web page load timings ⚡️.
export default () => {
  if (process.env.NODE_ENV === 'production' && Math.random() > SAMPLE_RATE / 100) {
    return;
  }

  const timeToInteractive = getTimeSinceNavigationStart();

  const datas = [
    {
      metric: 'timeToFirstByte',
      duration: getTimeToFirstByte(),
    },
    {
      metric: 'timeToFirstPaint',
      duration: getTimeToFirstPaint(),
    },
    {
      metric: 'timeToInteractive',
      duration: timeToInteractive,
    },
  ];

  datas.forEach(({ metric, duration }) => {
    // Ignore incoherent durations ]0,1h].
    if (duration && duration < 3600000) {
      analytics.trackTiming('load', metric, duration);
    }
  });

  // console.table(datas);
};
