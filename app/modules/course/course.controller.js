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

    if($routeParams.courseId) {
      CourseService.getCourse(vm.type, $routeParams.courseId).then(function (data) {
        //vm.courses = data.data;
        //vm.dtOptions = dataTableConfigService.init();
        console.log(data.data);
      });
    } else {
      CourseService.getCourses(vm.type).then(function (data) {
        vm.courses = data.data;
        vm.dtOptions = dataTableConfigService.init();
        console.log(data.data);
      });
    }

  }
})();
