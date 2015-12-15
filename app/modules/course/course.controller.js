;(function () {
  'use strict';

  angular.module('courseModule')
    .controller('CourseController', CourseController);

  CourseController.$inject = [
    '$scope',
    '$uibModal',
    'CourseService',
    'NotificationService',
    'StatusService'
  ];

  function CourseController($scope, $modal, CourseService, NotificationService, StatusService) {
    console.log('... CourseController');

    $scope.status = [];
    $scope.courses = [];

    StatusService.getStatus().then(function (data) {
      $scope.status = data.data;
    });

    CourseService.getCourseRoutes().then(function (data) {
      $scope.courses = data.data;
    });
  }
})();
