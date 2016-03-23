;(function () {
  'use strict';

  angular.module('faqModule')
    .config([
      '$routeProvider',
      function ($routeProvider) {
        $routeProvider
          .when('/faq', {
            templateUrl: 'modules/FAQ/faq.template.html',
            controller: 'faqController as vm',
            controllerAs: 'vm'
          })
          .when('/faq/new', {
            templateUrl: 'modules/FAQ/faq-new.template.html',
            controller: 'faqNewController as vm',
            controllerAs: 'ctrl'
          })
          .when('/faq/edit/:faqId', {
            templateUrl: 'modules/FAQ/faq-new.template.html',
            controller: 'faqNewController as vm',
            controllerAs: 'ctrl'
          });
      }
    ]);
})();
