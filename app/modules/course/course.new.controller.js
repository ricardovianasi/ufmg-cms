;
(function () {
    'use strict';

    angular
        .module('courseModule')
        .controller('CourseNewController', CourseNewController);

    /** ngInject */
    function CourseNewController($scope, CourseService, StatusService, $rootScope, $log) {
        $rootScope.shownavbar = true;
        $log.info('CourseController');

        $scope.courses = [];
        $scope.status = [];

        CourseService.getCourses().then(function (data) {
            $scope.courses = data.data;
        });

        StatusService.getStatus().then(function (data) {
            $scope.status = data.data;
        });
    }
})();
