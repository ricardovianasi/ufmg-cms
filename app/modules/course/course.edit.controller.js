;(function () {
  'use strict';

  angular.module('courseModule')
    .controller('CourseEditController', CourseEditController);

  CourseEditController.$inject = [
    '$timeout',
    '$location',
    '$scope',
    '$routeParams',
    'CourseService',
    'NotificationService',
    'StatusService',
    'ModalService'
  ];

  /**
   * @param $timeout
   * @param $location
   * @param $scope
   * @param $routeParams
   * @param CourseService
   * @param NotificationService
   * @param StatusService
   * @param ModalService
   *
   * @constructor
   */
  function CourseEditController($timeout,
                                $location,
                                $scope,
                                $routeParams,
                                CourseService,
                                NotificationService,
                                StatusService,
                                ModalService) {
    console.log('... CourseController');

    /**
     * get status
     *
     */
    $scope.status = [];
    StatusService.getStatus().then(function (data) {
      $scope.status = data.data;
    });

    /**
     * get selected course
     *
     * @param {integer} $routeParams.id
     */
    $scope.course = {};
    $scope.course.tags = [];
    $scope.courseId = $routeParams.courseId;
    $scope.type = $routeParams.type;

    CourseService.getCourse($routeParams.type, $routeParams.courseId, $routeParams.id).then(function (data) {
      $scope.course.subdivision_name = data.data.subdivision_name + ' - ' + data.data.modality;

      if (!_.isEmpty(data.data.detail)) {
        $scope.course = data.data;

        if (!_.isEmpty(data.data.detail.cover)) {
          $scope.course.cover = data.data.detail.cover;
          $scope.course.cover_url = data.data.detail.cover.url;
        }

        $scope.course.description = data.data.detail.description;
        $scope.course.status = data.data.detail.status;

        $scope.course.tags = [];

        angular.forEach($scope.course.detail.tags, function (tag) {
          $scope.course.tags.push(tag.name);
        });
      }
    });

    $scope.uploadImage = function () {
      var resolve = {
        formats: function () {
          return ['pageCover'];
        }
      };

      ModalService.uploadImage(resolve)
        .result
        .then(function (data) {
          $scope.course.cover = data.id;
          $scope.course.cover_url = data.url;
        });
    };

    $scope.removeImage = function () {
      $timeout(function () {
        $scope.course.cover = '';
        $scope.course.cover_url = '';
        $scope.$apply();
      });
    };

    $scope.publish = function (data) {
      CourseService.updateCourse($routeParams.id, data).then(function () {
        NotificationService.success('Course com sucesso.');
        $location.path('/course/list/' + $scope.type + '/' + $scope.courseId);
      });
    };

    $scope.redactorConfig = {
      plugins: false
    };
  }
})();
