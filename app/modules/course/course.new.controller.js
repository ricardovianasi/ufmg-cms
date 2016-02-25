;(function () {
  'use strict';

  angular
    .module('courseModule')
    .controller('CourseNewController', CourseNewController);

  CourseNewController.$inject = [
    '$scope',
    'CourseService',
    'StatusService'
  ];

  /**
   * @param $scope
   * @param CourseService
   * @param StatusService
   *
   * @constructor
   */
  function CourseNewController($scope, CourseService, StatusService) {
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
