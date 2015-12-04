;(function () {
  'use strict';

  angular.module('FilterModule')
    .filter('reverse', [
      function () {
        'use strict';

        return function (items) {
          return items.slice().reverse();
        };
      }
    ]);
})();
