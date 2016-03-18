;(function () {
  'use strict';

  angular.module('faqModule')
    .config([
      '$routeProvider',
      function ($routeProvider) {
        $routeProvider
          .when('/faq', {
            templateUrl: 'modules/faq/faq.template.html',
            controller: 'faqController as vm',
            controllerAs: 'vm'
          })
          .when('/faq/new', {
            templateUrl: 'modules/faq/faq-new.template.html',
            controller: 'faqNewController as vm',
            controllerAs: 'ctrl'
          });
      }
    ]);
})();
