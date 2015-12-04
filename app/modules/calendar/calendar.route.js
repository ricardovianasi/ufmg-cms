;(function(){
  'use strict';

  angular
    .module("calendarModule")
    .config("$routeProvider", function($routeProvider) {
      "use strict";

      $routeProvider
        .when("/calendar", {
          templateUrl: "/modules/calendar/calendar.template.html",
          controller: "CalendarController",
          controllerAs: "ctrl"
        });
    });

})();
