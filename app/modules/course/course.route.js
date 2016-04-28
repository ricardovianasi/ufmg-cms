;(function(){

  'use strict';

  angular
    .module('courseModule')
    .config(['$routeProvider', function($routeProvider){

      $routeProvider
        .when('/course', {
          templateUrl: 'modules/course/course-types.template.html',
          resolve: {
            isLogged: ['sessionService', function(sessionService) {
              return sessionService.getIsLogged();
            }]
          }
        })
        .when('/course/list/:type', {
          templateUrl: 'modules/course/course.template.html',
          controller: 'CourseController',
          controllerAs: 'vm',
          resolve: {
            isLogged: ['sessionService', function(sessionService) {
              return sessionService.getIsLogged();
            }]
          }
        })
        .when('/course/list/:type/:courseId', {
          templateUrl: 'modules/course/routes.template.html',
          controller: 'CourseController',
          controllerAs: 'vm',
          resolve: {
            isLogged: ['sessionService', function(sessionService) {
              return sessionService.getIsLogged();
            }]
          }
        })
        .when('/course/new', {
          templateUrl: 'modules/course/course.form.template.html',
          controller: 'CourseNewController',
          controllerAs: 'ctrl',
          resolve: {
            isLogged: ['sessionService', function(sessionService) {
              return sessionService.getIsLogged();
            }]
          }
        })
        .when('/course/edit/:type/:courseId/:id', {
          templateUrl: 'modules/course/course.form.template.html',
          controller: 'CourseEditController',
          controllerAs: 'ctrl',
          resolve: {
            isLogged: ['sessionService', function(sessionService) {
              return sessionService.getIsLogged();
            }]
          }
        })
        .when('/course/sidebar/:type', {
          templateUrl: 'modules/course/course.sidebar.template.html',
          controller: 'CourseSidebarController',
          controllerAs: 'vm',
          resolve: {
            isLogged: ['sessionService', function(sessionService) {
              return sessionService.getIsLogged();
            }]
          }
        })
        .when('/course/sidebar/:type/:courseId', {
          templateUrl: 'modules/course/course.sidebar.template.html',
          controller: 'CourseSidebarController',
          controllerAs: 'vm',
          resolve: {
            isLogged: ['sessionService', function(sessionService) {
              return sessionService.getIsLogged();
            }]
          }
        });
    }]);

})();
