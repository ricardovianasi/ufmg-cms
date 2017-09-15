(function () {

    'use strict';

    angular
        .module('courseModule')
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/course', {
                    templateUrl: 'modules/course/course-types.template.html'
                })
                .when('/course/list/:type', {
                    templateUrl: 'modules/course/course.template.html',
                    controller: 'CourseController',
                    controllerAs: 'vm'
                })
                .when('/course/edit/:type/:courseId', {
                    templateUrl: 'modules/course/course.form.template.html',
                    controller: 'CourseController',
                    controllerAs: 'vm'
                })
                .when('/course/view/:type/:courseId', {
                    templateUrl: 'modules/course/course.form.template.html',
                    controller: 'CourseController',
                    controllerAs: 'vm'
                })
                .when('/course/sidebar/:type', {
                    templateUrl: 'modules/course/course.sidebar.template.html',
                    controller: 'CourseSidebarController',
                    controllerAs: 'vm'
                })
                .when('/course/sidebar/:type/:courseId', {
                    templateUrl: 'modules/course/course.sidebar.template.html',
                    controller: 'CourseSidebarController',
                    controllerAs: 'vm'
                });
        }]);

})();
