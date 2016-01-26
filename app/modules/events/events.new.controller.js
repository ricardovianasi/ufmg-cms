;(function () {
  'use strict';

  angular.module('eventsModule')
    .controller('EventsNewController', EventsNewController);

  EventsNewController.$inject = [
    '$scope',
    '$timeout',
    '$location',
    'CourseService',
    'EventsService',
    'MediaService',
    'NotificationService',
    'StatusService',
    'DateTimeHelper'
  ];

  /**
   * @param $scope
   * @param $timeout
   * @param $location
   * @param CourseService
   * @param EventsService
   * @param MediaService
   * @param NotificationService
   * @param StatusService
   * @param DateTimeHelper
   *
   * @constructor
   */
  function EventsNewController($scope,
                               $timeout,
                               $location,
                               CourseService,
                               EventsService,
                               MediaService,
                               NotificationService,
                               StatusService,
                               DateTimeHelper) {
    console.log('... EventsNewController');

    $scope.title = 'Novo Evento';
    $scope.breadcrumb = $scope.title;
    $scope.event = {
      status: StatusService.STATUS_PUBLISHED,
      courses: [],
      tags: []
    };
    $scope.categories = [];
    $scope.courses = [];

    /**
     * Controls event.courses array
     *
     * @param {number} courseId
     */
    $scope.toggleSelection = function toggleSelection(courseId) {
      var idx = $scope.event.courses.indexOf(courseId);

      if (idx > -1) {
        $scope.event.courses.splice(idx, 1);
      } else {
        $scope.event.courses.push(courseId);
      }
    };

    /**
     * Datepicker options
     */
    $scope.datepickerOpt = {
      initDate: DateTimeHelper.getDatepickerOpt(),
      endDate: DateTimeHelper.getDatepickerOpt()
    };

    /**
     * Add status 'on the fly', according to requirements
     *
     * @type {{opened: boolean}}
     */
    $scope.datepickerOpt.initDate.status = {
      opened: false
    };
    $scope.datepickerOpt.endDate.status = {
      opened: false
    };

    /**
     * Timepicker options
     */
    $scope.timepickerOpt = {
      initTime: DateTimeHelper.getTimepickerOpt(),
      endTime: DateTimeHelper.getTimepickerOpt()
    };

    $scope.imagencropOptions = {
      /**
       * @param redactor
       * @param data
       */
      callback: function (redactor, data) {
        var cropped = function (size, data) {
          var html = _.template($('#figure-' + size).html());

          redactor.selection.restore();
          redactor.insert.raw(html(data));
        };

        var croppedObj = {
          url: data.url,
          legend: data.legend ? data.legend : '',
          author: data.author ? data.author : ''
        };

        cropped(data.type, croppedObj);
      },
      formats: ['vertical', 'medium']
    };

    $scope.audioUploadOptions = {
      /**
       * @param redactor
       * @param data
       */
      callback: function (redactor, data) {
        var html = _.template($('#audio').html());

        redactor.selection.restore();
        redactor.insert.raw(html(data));
      }
    };

    // Watch IMG elements to upload
    $scope.$watch('event.poster', function () {
      if ($scope.event.poster && $scope.event.poster instanceof File) {
        $scope.imgHandler.upload('poster', [
          $scope.event.poster
        ]);
      }
    });

    $scope.$watch('event.photo', function () {
      if ($scope.event.photo && $scope.event.photo instanceof File) {
        $scope.imgHandler.upload('photo', [
          $scope.event.photo
        ]);
      }
    });

    /**
     * Handle img upload
     */
    $scope.imgHandler = {
      upload: function (elem, files) {
        angular.forEach(files, function (file) {
          MediaService.newFile(file).then(function (data) {
            $scope.event[elem] = {
              url: data.url,
              id: data.id
            };
          });
        });
      },
      removeImage: function (elem) {
        $timeout(function () {
          $scope.event[elem] = '';
          $scope.$apply();
        });
      }
    };

    /**
     * Post to Event Endpoint
     *
     * @param data
     */
    $scope.publish = function (data) {
      data.tags = _.map(data.tags, 'text');

      EventsService.store(data).then(function () {
        NotificationService.success('Evento criado com sucesso.');
        $location.path('/events');
      });
    };

    // Undergraduate Courses
    CourseService.getCourses('graduation').then(function (data) {
      $scope.courses = data.data;
    });

    // Events Categories
    EventsService.getEventsCategories().then(function (data) {
      $scope.categories = data.data;
    });

    // Statuses
    StatusService.getStatus().then(function (data) {
      $scope.statuses = data.data;
    });
  }
})();
