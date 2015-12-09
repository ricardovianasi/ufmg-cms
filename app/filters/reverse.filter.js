;(function () {
  'use strict';

  angular.module('filterModule')
    .filter('reverse', [
      function () {
        return function (items) {
          return items.slice().reverse();
        };
      }
    ]);
})();
