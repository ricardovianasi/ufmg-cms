;(function () {
  'use strict';

  angular.module('courseModule')
    .controller('CourseController', CourseController);

  CourseController.$inject = [
    '$scope',
    '$uibModal',
    '$routeParams',
    'CourseService',
    'dataTableConfigService',
    'NotificationService',
    'StatusService'
  ];

  function CourseController($scope,
                            $modal,
                            $routeParams,
                            CourseService,
                            dataTableConfigService,
                            NotificationService) {
    console.log('... CourseController');
    var vm = this;
        vm.type = $routeParams.type;
        vm.courseId = $routeParams.courseId;

    if(vm.courseId) {
      CourseService.getCourseRoutes(vm.type, vm.courseId).then(function (data) {
        vm.courses = data.data;
        vm.dtOptions = dataTableConfigService.init();
      });
    } else {
      CourseService.getCourses(vm.type).then(function (data) {
        vm.courses = data.data;
        vm.dtOptions = dataTableConfigService.init();
      });
    }




  }
})();
