;(function () {
  'use strict';

  angular.module('FilterModule')
    .filter('reverse', [
      function () {
        return function (items) {
          return items.slice().reverse();
        };
      }
    ]);
})();
