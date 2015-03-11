'use strict';

var director = require('director');
var router = new director.Router();

var silent = false;

router.history = true; // to make work router.explode()

router.setRoute = function(route, options) {
  var routeOld = router.getPath();
  route = (route.charAt(0) === '/') ? route : '/' + route;

  if (routeOld !== route) {
    window.history.pushState({}, '', route);

    if (!options || !options.silent) {
      this.dispatch('on', router.getPath());
    }
  }
};

// No triggered by pushState
window.addEventListener('popstate', function() {
  router.dispatch('on', router.getPath());
});

module.exports = router;
