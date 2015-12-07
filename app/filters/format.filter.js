;(function () {
  'use strict';

  angular.module('FilterModule')
    .filter('format', [
      function () {
        return function (str) {
          if (!str || arguments.length <= 1) {
            return str;
          }

          for (var i = 1; i < arguments.length; i++) {
            var reg = new RegExp("\\{" + (i - 1) + "\\}", "gm");

            str = str.replace(reg, arguments[i]);
          }

          return str;
        };
      }
    ]);
})();
