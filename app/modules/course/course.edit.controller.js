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
    'ModalService',
    '$rootScope',
    'TagsService'
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
                                ModalService,
                                $rootScope,
                                TagsService) {

    $rootScope.shownavbar = true;
    console.log('... CourseController');

    var allTags = [];

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
      var courseData = data.data;

      $scope.course.subdivision_name = courseData.subdivision_name + ' - ' + courseData.modality;

      if (!_.isEmpty(courseData.detail)) {
        $scope.course = courseData;

        if (!_.isEmpty(courseData.detail.cover)) {
          $scope.course.cover = courseData.detail.cover;
          $scope.course.cover_url = courseData.detail.cover.url;
        }

        $scope.course.description = courseData.detail.description;
        $scope.course.status = courseData.detail.status;
        $scope.course.name = courseData.detail.name;

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
      _parseData(data);

      CourseService.updateCourse($routeParams.id, data).then(function () {
        NotificationService.success('Course com sucesso.');
        $location.path('/course/list/' + $scope.type + '/' + $scope.courseId);
      });
    };

    $scope.redactorConfig = {
      plugins: false
    };

      /**
       *
       * @param data
       * @private
       */
    function _parseData(data) {
      if(typeof data.cover == 'object')
        data.cover = data.cover.id;
    }

    TagsService.getTags().then(function(data){
      allTags = data.data.items[0];
    });

    $scope.findTags = function($query) {
      return TagsService.findTags($query, allTags);
    };
  }
})();
