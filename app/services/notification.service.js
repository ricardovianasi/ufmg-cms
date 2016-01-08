;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('NotificationService', NotificationService);

  NotificationService.$inject = ['toastr'];

  function NotificationService(toastr) {
    clog('... NotificationService');

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
})();
