;(function () {
  'use strict';

  angular.module('newsModule')
    .config([
      '$routeProvider', function ($routeProvider) {
        $routeProvider
          .when('/news', {
            templateUrl: 'modules/news/news.template.html',
            controller: 'NewsController',
            controllerAs: 'ctrl'
          })
          .when('/news/new', {
            templateUrl: 'modules/news/news.form.template.html',
            controller: 'NewsNewController',
            controllerAs: 'ctrl'
          })
          .when('/news/edit/:id', {
            templateUrl: 'modules/news/news.form.template.html',
            controller: 'NewsEditController',
            controllerAs: 'ctrl'
          });
      }
    ]);
})();
