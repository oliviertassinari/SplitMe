'use strict';

var director = require('director');
var router = new director.Router();

var baseUrl = '';

// The assets are not a the url /
if ('production' === process.env.NODE_ENV) {
  baseUrl = window.location.pathname.replace('/index.html', '');
}

router.setRoute = function(route, options) {
  var routeOld = router.getPath();
  route = (route.charAt(0) === '/') ? route : '/' + route; // Always start with /
  route = baseUrl + route;

  if (routeOld !== route) {
    window.history.pushState({}, '', route);

    if (options && options.silent === false) {
      this.dispatch('on', router.getPath());
    }
  }
};

// No triggered by pushState
window.addEventListener('popstate', function() {
  var route = router.getPath().substring(baseUrl.length); // Start after the end of baseUrl
  router.dispatch('on', route);
});

module.exports = router;
