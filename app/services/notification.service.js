;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('NotificationService', [
      'toastr',
      function (toastr) {
        console.log('... NotificationService');

        return {
          success: function (title, msg) {
            toastr.success(title, msg);
          },
          error: function (title, msg) {
            toastr.error(title, msg);
          },
          warning: function (title, msg) {
            toastr.warning(title, msg);
          }
        };
      }
    ]);
})();
