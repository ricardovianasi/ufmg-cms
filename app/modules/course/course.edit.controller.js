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
    'DateTimeHelper',
    'MediaService'
  ];

  function CourseEditController($timeout,
                                $location,
                                $scope,
                                $routeParams,
                                CourseService,
                                NotificationService,
                                StatusService,
                                DateTimeHelper,
                                MediaService) {
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
    CourseService.getCourse($routeParams.id).then(function (data) {

      if (!_.isEmpty(data.data.detail) && !_.isEmpty(data.data.detail.cover)) {
        $scope.course = data.data;
        $scope.course.cover = data.data.cover;
        $scope.course.cover_url = data.data.cover_url;
        $scope.course.description = data.data.description;
        $scope.course.status = data.data.detail.status;
      }

      $scope.course.tags = [];

      if (!_.isEmpty($scope.course.detail.tags)) {
        angular.forEach($scope.course.detail.tags, function (tag) {
          $scope.course.tags.push(tag.name);
        });
      }

      var scheduled_at = DateTimeHelper.toBrStandard(data.data.detail.scheduled_at, true, true);

      if (scheduled_at) {
        $scope.course.scheduled_date = scheduled_at.date ? scheduled_at.date : '';
        $scope.course.scheduled_time = scheduled_at.time ? scheduled_at.time : '';
      }
    });


    $scope.$watch('course_cover', function () {
      if ($scope.course_cover) {
        $scope.upload([$scope.course_cover]);
      }
    });

    $scope.upload = function (files) {
      angular.forEach(files, function (file) {
        var obj = {
          title: file.title ? file.title : '',
          description: file.description ? file.description : '',
          altText: file.alt_text ? file.alt_text : '',
          legend: file.legend ? file.legend : ''
        };
        MediaService.newFile(file).then(function (data) {
          $scope.course.cover = data.id;
          $scope.course.cover_url = data.url;
        });
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
      CourseService.updateCourse($routeParams.id, data).then(function (data) {
        NotificationService.success('Course com sucesso.');
        $location.path('/course');
      });
    };

    $scope.redactorConfig = {
      lang: 'pt_br',
      replaceDivs: false,
      plugins: ['imagencrop'],
      buttons: [
        'html',
        'formatting',
        'bold',
        'italic',
        'deleted',
        'unorderedlist',
        'orderedlist',
        'outdent',
        'indent',
        'image',
        'file',
        'link',
        'alignment',
        'horizontalrule',
        'imagencrop'
      ],
      allowedAttr: [
        ['section', 'class'],
        ['div', 'class'],
        ['img', ['src', 'alt']],
        ['figure', 'class'],
        ['a', ['href', 'title']]
      ]
    };
  }
})();
