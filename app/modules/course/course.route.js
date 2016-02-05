;(function(){

  'use strict';

  angular
    .module('courseModule')
    .config(['$routeProvider', function($routeProvider){

      $routeProvider
        .when('/course', {
          templateUrl: 'modules/course/course-types.template.html',
        })
        .when('/course/list/:type', {
          templateUrl: 'modules/course/course.template.html',
          controller: 'CourseController',
          controllerAs: 'vm'
        })
        .when('/course/list/:type/:courseId', {
          templateUrl: 'modules/course/routes.template.html',
          controller: 'CourseController',
          controllerAs: 'vm'
        })
        .when('/course/new', {
          templateUrl: 'modules/course/course.form.template.html',
          controller: 'CourseNewController',
          controllerAs: 'ctrl'
        })
        .when('/course/edit/:type/:courseId/:id', {
          templateUrl: 'modules/course/course.form.template.html',
          controller: 'CourseEditController',
          controllerAs: 'ctrl'
        })
        .when('/course/sidebar/:type', {
          templateUrl: 'modules/course/course.sibebar.template.html',
          controller: 'CourseSidebarController',
          controllerAs: 'vm'
        })
        .when('/course/sidebar/:type/:courseId', {
          templateUrl: 'modules/course/course.sibebar.template.html',
          controller: 'CourseSidebarController',
          controllerAs: 'vm'
        });
    }]);

})();
