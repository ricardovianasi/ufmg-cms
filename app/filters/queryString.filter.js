;(function () {
  'use strict';

  angular.module('filterModule')
    .filter('queryString', QueryString);

  /**
   * @returns {qs}
   *
   * @constructor
   */
  function QueryString() {
    var qs = function (obj, prefix) {
      var str = [];

      for (var p in obj) {
        var k = prefix ? prefix + "[" + p + "]" : p;
        var v = obj[p];

        str.push(angular.isObject(v) ? qs(v, k) : (k) + "=" + encodeURIComponent(v));
      }

      return str.join("&");
    };

    return qs;
  }
})();
