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

    if (options && options.silent === false) {
      this.dispatch('on', router.getPath());
    }
  }
};

// router.setRouteAdd = function(add, options) {
//   var url = this.getPath();
//   this.setRoute(url + '/' + add, options);
// };

// // Remove last /
// router.setRouteBack = function(options) {
//   var url = this.explode();
//   url.splice(-1, 1);
//   this.setRoute(url.join('/'), options);
// };

// router.navigateBack = function() {
//   window.history.back();
// };

// No triggered by pushState
window.addEventListener('popstate', function() {
  router.dispatch('on', router.getPath());
});

module.exports = router;
