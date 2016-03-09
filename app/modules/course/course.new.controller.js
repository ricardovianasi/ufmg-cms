;(function () {
  'use strict';

  angular
    .module('courseModule')
    .controller('CourseNewController', CourseNewController);

  CourseNewController.$inject = [
    '$scope',
    'CourseService',
    'StatusService',
    '$rootScope'
  ];

  /**
   * @param $scope
   * @param CourseService
   * @param StatusService
   *
   * @constructor
   */
  function CourseNewController($scope, CourseService, StatusService, $rootScope) {
    $rootScope.shownavbar = true;
    console.log('... CourseController');

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
