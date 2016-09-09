// @flow weak

import analytics from 'modules/analytics/analytics';

/**
 * Returns the browser's first paint metric (if available).
 * @return {number} The first paint time in ms.
 */
function getFirstPaintTiming() {
  if (window.chrome && window.chrome.loadTimes) {
    const load = window.chrome.loadTimes();
    const fp = (load.firstPaintTime - load.startLoadTime) * 1000;
    return Math.round(fp);
  } else if ('performance' in window) {
    const navTiming = window.performance.timing;
    // See http://msdn.microsoft.com/ff974719
    if (navTiming && navTiming.msFirstPaint && navTiming.navigationStart !== 0) {
      // See http://msdn.microsoft.com/ff974719
      return navTiming.msFirstPaint - navTiming.navigationStart;
    }
  }

  return null;
}

export default function() {
  const firstPaintTiming = getFirstPaintTiming();
  if (firstPaintTiming) {
    analytics.trackTiming('load', 'firstpaint', firstPaintTiming);
  }
}
