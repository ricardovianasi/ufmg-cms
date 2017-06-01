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
                    controllerAs: 'vm',
                    resolve: {
                        permission: ['PermissionService', '$window', '$routeParams',
                            function (PermissionService, $window, $routeParams) {
                                var canPut = PermissionService.canPut('course_' + $routeParams.type, $routeParams.courseId);
                                var canPost = PermissionService.canPost('course_' + $routeParams.type, $routeParams.courseId);
                                if (canPost || canPut) {
                                    return true;
                                }
                                return false;
                            }
                        ]
                    }
                })
                .when('/course/edit/:type/:courseId', {
                    templateUrl: 'modules/course/course.form.template.html',
                    controller: 'CourseController',
                    controllerAs: 'vm',
                    resolve: {
                        permission: ['PermissionService', '$window', '$routeParams',
                            function (PermissionService, $window, $routeParams) {
                                var canPut = PermissionService.canPut('course_' + $routeParams.type, $routeParams.courseId);
                                var canPost = PermissionService.canPost('course_' + $routeParams.type, $routeParams.courseId);
                                if (canPost || canPut) {
                                    return true;
                                }
                                $window.location.href = '#/course/list/' + $routeParams.type;
                                return false;
                            }
                        ]
                    }
                })
                .when('/course/view/:type/:courseId', {
                    templateUrl: 'modules/course/course.form.template.html',
                    controller: 'CourseController',
                    controllerAs: 'vm',
                    resolve: {
                        permission: function () {
                            return false;
                        }
                    }
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
