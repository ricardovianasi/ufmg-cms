;(function(){
  "use strict";

  angular
    .module('courseModule')
    .controller("CourseNewController", CourseNewController);

    CourseNewController.$inject = [
      '$scope',
      '$modal',
      'CourseService',
      'NotificationService',
      'StatusService'
    ];

    function CourseNewController($scope, $modal, CourseService, NotificationService, StatusService) {
      console.log('... CourseController');

      $scope.courses = [];
      CourseService.getCourses().then(function (data) {
        $scope.courses = data.data;
      });

      $scope.status = [];
      StatusService.getStatus().then(function (data) {
        $scope.status = data.data;
      });
    };
})();
