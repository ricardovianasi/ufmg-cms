;(function () {
  'use strict';

  angular.module('eventsModule')
    .controller('EventsEditController', EventsEditController);

  EventsEditController.$inject = [
    '$scope',
    '$timeout',
    '$location',
    '$routeParams',
    '$window',
    'CourseService',
    'EventsService',
    'MediaService',
    'NotificationService',
    'StatusService',
    'ModalService',
    'DateTimeHelper',
  ];

  /**
   * @param $scope
   * @param $timeout
   * @param $location
   * @param $routeParams
   * @param $window
   * @param CourseService
   * @param EventsService
   * @param MediaService
   * @param NotificationService
   * @param StatusService
   * @param ModalService
   * @param DateTimeHelper
   *
   * @constructor
   */
  function EventsEditController($scope,
                                $timeout,
                                $location,
                                $routeParams,
                                $window,
                                CourseService,
                                EventsService,
                                MediaService,
                                NotificationService,
                                StatusService,
                                ModalService,
                                DateTimeHelper) {
    console.log('... EventsEditController');

    $scope.title = 'Editar Evento: ';
    $scope.breadcrumb = $scope.title;
    $scope.event = {
      courses: [],
      tags: []
    };
    $scope.categories = [];
    $scope.courses = [];

    /**
     * Controls event.courses array
     *
     * @param {integer} courseId
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
     * @param preview
     */
    $scope.publish = function (data, preview) {
      data.tags = _.map(data.tags, 'text');

      EventsService.update(data, $routeParams.id).then(function (event) {
        NotificationService.success('Evento atualizado com sucesso.');

        if (!preview) {
          $location.path('/events');
        } else {
          $window.open(event.data.event_url);
        }
      });
    };

    /**
     *
     */
    $scope.remove = function () {
      ModalService
        .confirm('Você deseja excluir o evento <b>' + $scope.event.name + '</b>?', ModalService.MODAL_MEDIUM)
        .result
        .then(function () {
          EventsService.destroy($routeParams.id).then(function () {
            NotificationService.success('Evento removido com sucesso.');
            $location.path('/events');
          });
        });
    };

    EventsService.getEvent($routeParams.id).then(function (data) {
      var event = data.data;
      var tags = event.tags;
      var courses = event.courses;

      event.courses = [];
      event.tags = [];
      event.initDate = event.init_date;
      event.endDate = event.end_date;

      event.initTime = event.initDate;
      event.endTime = event.endDate;

      delete event.init_date;
      delete event.end_date;

      angular.forEach(courses, function (course) {
        event.courses.push(course.id);
      });

      // delete event.undergraduate_courses;

      event.type = event.type.id;

      delete event.event_type;

      angular.forEach(tags, function (tag) {
        event.tags.push(tag.name);
      });

      var scheduled_at = DateTimeHelper.toBrStandard(event.scheduled_at, true, true);
      event.scheduled_date = scheduled_at.date;
      event.scheduled_time = scheduled_at.time;

      $scope.event = event;
    });

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
